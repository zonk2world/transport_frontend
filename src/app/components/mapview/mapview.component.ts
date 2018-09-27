///<reference path="../../../../node_modules/@types/leaflet/index.d.ts"/>
///<reference path="../../../../node_modules/@types/leaflet-draw/index.d.ts"/>
import {Component, Input, Output, EventEmitter, OnInit, OnChanges, ViewChild, SimpleChanges, Injector, ViewEncapsulation, ApplicationRef, ComponentFactoryResolver} from '@angular/core';

import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

import MapOptions from '../../classes/MapOptions';
import * as L from 'leaflet';
import 'leaflet-draw';

import {LineComponent} from "../line/line.component";
import {Stop} from "../../classes/stop";
import {e} from "@angular/core/src/render3";

import { LineService } from '../../services/line.service'

import * as $ from 'jquery';
import {PopupComponent} from "../popup/popup.component";

@Component({
  selector: 'app-mapview',
  templateUrl: './mapview.component.html',
  styleUrls: ['./mapview.component.css'],
  encapsulation: ViewEncapsulation.None
  /* template:
    `    <app-line [myMap]="map"></app-line>    ` */
})


export class MapviewComponent implements OnInit, OnChanges {
  private provider = new OpenStreetMapProvider();
  @Input() private options: MapOptions;
  @Input() mapdata: string;
  @Input() newStopAdded: Stop;
  @Input() stopsToDisplay: Stop[];
  @Input() itinerariesStops: any[];
  @Input() teams: any[];

  // @Input() markerIconsPath: string;

  @Output() mapDataChangedEmitter: EventEmitter<string> = new EventEmitter<string>();
  @Output() mapDataClickedEmitter: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('mapDiv') mapContainer;

  private mapDataObj: L.GeoJSON;
  private map: L.Map;
  private drawItems: L.FeatureGroup;
  private tmpMarker: L.Marker;
  private busStopMarkers = {};
  private busStopMarkersToDisplayOnLineClick = {};

  circleIcons: any[] = [];
  teamIcon: any;
  componentRef: any;
  teamMarkers: any[] = [];
  teamMarker: L.Marker;

  myRenderer: any;

  // leafletDrawDirective: LeafletDrawDirective;

  private baseMaps = {
    OpenStreetMap: L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, ' +
      'Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
    }),
    Esri: L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, ' +
        'NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
    }),
    CartoDB: L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; ' +
      '<a href="http://cartodb.com/attributions">CartoDB</a>'
    })
  };

  constructor(private appRef: ApplicationRef,
              private injector: Injector,
              private componentFactoryResolver: ComponentFactoryResolver,
              private lineService: LineService)
  {
    this.circleIcons['YELLOW'] = new L.Icon({
         iconUrl: '/assets/circles/yellow.png',
         iconSize: [17, 17]
       });
     this.circleIcons['GREEN'] = new L.Icon({
            iconUrl: '/assets/circles/green.png',
            iconSize: [17, 17]
          });
      this.circleIcons['BLUE'] = new L.Icon({
           iconUrl: '/assets/circles/blue.png',
           iconSize: [17, 17]
         });
       this.circleIcons['OLIVE'] = new L.Icon({
            iconUrl: '/assets/circles/olive.png',
            iconSize: [17, 17]
          });
      this.circleIcons['PURPLE'] = new L.Icon({
           iconUrl: '/assets/circles/purple.png',
           iconSize: [17, 17]
         });
    this.circleIcons['BLACK'] = new L.Icon({
         iconUrl: '/assets/circles/black.png',
         iconSize: [17, 17]
       });
    this.circleIcons['RED'] = new L.Icon({
          iconUrl: '/assets/circles/red.png',
          iconSize: [17, 17]
        });
    this.circleIcons['MAROON'] = new L.Icon({
         iconUrl: '/assets/circles/maroon.png',
         iconSize: [17, 17]
       });
    this.circleIcons['SILVER'] = new L.Icon({
         iconUrl: '/assets/circles/silver.png',
         iconSize: [17, 17]
       });
     this.circleIcons['AQUA'] = new L.Icon({
          iconUrl: '/assets/circles/aqva.png',
          iconSize: [17, 17]
        });
    this.circleIcons['LIME'] = new L.Icon({
         iconUrl: '/assets/circles/lime.png',
         iconSize: [17, 17]
       });
     this.circleIcons['GRAY'] = new L.Icon({
          iconUrl: '/assets/circles/gray.png',
          iconSize: [17, 17]
        });
    this.circleIcons['WHITE'] = new L.Icon({
         iconUrl: '/assets/circles/white.png',
         iconSize: [17, 17]
       });
     this.circleIcons['TEAL'] = new L.Icon({
          iconUrl: '/assets/circles/teal.png',
          iconSize: [17, 17]
        });
    this.circleIcons['NAVY'] = new L.Icon({
       iconUrl: '/assets/circles/navy blue.png',
       iconSize: [17, 17]
     });
     this.circleIcons['FUCHSIA'] = new L.Icon({
          iconUrl: '/assets/circles/Fuchsia.png',
          iconSize: [17, 17]
        });

  }

  ngOnInit() {
    this.configureMap();
    this.handleEvents();
    this.displayDrawings();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("changes :", changes);
    if(changes.stopsToDisplay){
      this.addLineOnMap(this.stopsToDisplay);
    }
    if(changes.newStopAdded){
      //this.addLineOnMap(this.stopsToDisplay);
      this.addBusStopPermanently(changes.newStopAdded.currentValue);
    }
    if(changes.itinerariesStops){
      this.removeLayers('Stop');
      // console.log("changes.itinerariesStops :", changes.itinerariesStops);
      this.addItinerariesStop(changes.itinerariesStops.currentValue);
      // this.clearMap();
      // this.displayDrawings();
    }
    if(changes.teams){
      console.log("changes.teams :", changes.teams);
      this.removeLayers('Team');
      this.addTeams(changes.teams.currentValue);
    }
  }

  renderHTMLStationPopUp(name, start, end){
    return    `<div class="container-name" style="bottom: 13px; border-bottom: solid 2px #1c2831; position: relative;">`+
                `<div class="name" style="color: #25aae1; text-align: center; "> ${name} </div> `+
              `</div>`+
              `<div class="container-schedule">` +
                `<i class="fa fa-clock-o" aria-hidden="true" style="color: #25aae1"></i> <span class="schedule" style="color: white;"> ${start} - ${end}</span>`+
              `</div>`;
  }

  renderHTMLTeamPopUp(name, lat, long){
    return    `<div class="container-name" style="bottom: 13px; border-bottom: solid 2px #1c2831; position: relative;">`+
                `<div class="name" style="color: #25aae1; text-align: center; "> ${name} </div> `+
              `</div>`+
              `<div class="container-schedule">` +
                `<i class="glyphicon glyphicon-map-marker" aria-hidden="true" style="color: #25aae1"></i> <span class="schedule" style="color: white;"> ${lat} - ${long}</span>`+
              `</div>`;
  }

  // renderHTMLTeamIcon(onAttach){
  //   if(this.componentRef){
  //     this.componentRef.destroy();
  //   }
  //   const compFactory = this.componentFactoryResolver.resolveComponentFactory(PopupComponent);
  //   this.componentRef = compFactory.create(this.injector);
  //   this.componentRef.instance.teamSelectedChanged.subscribe(team => {
  //     team.selected? this.map.addLayer(this.teamMarkers[team.uid]) : this.map.removeLayer(this.teamMarkers[team.uid]);
  //   });
  //   if (onAttach)
  //       onAttach(this.componentRef);
  //
  //   if (this.appRef['attachView']) { // since 2.3.0
  //    this.appRef['attachView'](this.componentRef.hostView);
  //    this.componentRef.onDestroy(() => {
  //      this.appRef['detachView'](this.componentRef.hostView);
  //   });
  //  } else {
  //   this.appRef['registerChangeDetector'](this.componentRef.changeDetectorRef);
  //   this.componentRef.onDestroy(() => {
  //     this.appRef['unregisterChangeDetector'](this.componentRef.changeDetectorRef);
  //   });
  //   }
  //
  //   let div = document.createElement('div');
  //   div.appendChild(this.componentRef.location.nativeElement);
  //   return div;
  // }

  removeLayers(kind: string){
    if(this.map){
      this.map.eachLayer(layer => {
        console.log("layer :", layer);
        if(!layer.hasOwnProperty('_container')){
          if(kind === "Team" && layer['_popup'] && layer['_popup'].options.className === "popupTeamCustom")
            this.map.removeLayer(layer);
          else if(kind === "Stop" && layer['_popup'] && layer['_popup'].options.className === "popupCustom")
            this.map.removeLayer(layer);
          else if(kind === "Stop" && !layer['_popup'])
            this.map.removeLayer(layer);
        }
      });
    }
  }

  addTeams(teams){
    console.log("teams :", teams);
    teams.forEach(team => {
      var teamIcon = L.divIcon({
          //html: this.renderHTMLTeamIcon(),
          html: `<span class="fa fa-group" style="color: ${team.color}; font-size: 200%; background: transparent;"></span>`,
          className: 'teamMarker'
      });
      this.teamMarkers[team.uid] = L.marker([team.latitude, team.longitude], {icon: teamIcon})
        .addTo(this.map).bindPopup(this.renderHTMLTeamPopUp(team.name, team.latitude, team.longitude), {className: 'popupTeamCustom'});
    });
    // if(this.map){
    //   this.teamMarker = L.marker(this.map.getCenter(), {
    //     icon: this.circleIcons['YELLOW'],
    //     draggable: true
    //   }).addTo(this.map)
    //     .bindPopup(this.renderHTMLTeamIcon((c) => { c.instance.teams = this.teams; }), {className: 'popupCustom'})
    //     .openPopup();
    // }
  }

  addItinerariesStop(stops){
    console.log("stops :", stops);
    stops.forEach(itinerariesStops => {
      let coords = [];
      itinerariesStops.forEach(stop => {
        var circle = L.marker([stop.latitude, stop.longitude], {icon: this.circleIcons[stop.color]})
          .addTo(this.map).bindPopup(this.renderHTMLStationPopUp(stop.name, stop.start, stop.end), {className: 'popupCustom'});

        coords.push(circle.getLatLng());
      });
      var polyline = L.polyline(coords,{color: itinerariesStops[0].color}).addTo(this.map);
      // this.drawItems.addLayer(polyline);
    });
  }

  addBusStopPermanently(stop){
    console.log(stop);
    if(typeof stop != 'undefined'){
      if(stop.name != ''){
        if (typeof this.tmpMarker !== 'undefined') {
          this.map.removeLayer(this.tmpMarker);
        }

        const leafIcon = this.circleIcons['BLUE'];

        const marker = new L.Marker([stop.latitude, stop.longitude], {icon: leafIcon});
        marker.addTo(this.map).bindPopup('Bus Stop no. '+stop.position + '\n'
          + stop.name + '\n'
          + stop.latitude + ' : ' + stop.longitude).openPopup();

        if(!this.busStopMarkers.hasOwnProperty(stop.route)){
          this.busStopMarkers[stop.route] = {'markers' : [], 'polylist' : Array(), 'polyline': L.polyline([])};
        }

        this.busStopMarkers[stop.route].markers.push(marker);

        this.map.removeLayer(this.busStopMarkers[stop.route].polyline);

        this.busStopMarkers[stop.route].polylist.push(marker.getLatLng());

        this.busStopMarkers[stop.route].polyline = L.polyline(this.busStopMarkers[stop.route].polylist,{color: 'blue'}).addTo(this.map);

        console.log(this.busStopMarkers);
      }
      else {
        for(let elmnt of this.busStopMarkers[stop.route].markers){
          this.map.removeLayer(elmnt);
        }
        this.map.removeLayer(this.busStopMarkers[stop.route].polyline);
      }
    }
  }

  addLineOnMap(stops){
    if(stops.length > 0){
      if(Object.keys(this.busStopMarkersToDisplayOnLineClick).length !== 0){
        for(var stopId in this.busStopMarkersToDisplayOnLineClick){
          this.map.removeLayer(this.busStopMarkersToDisplayOnLineClick[stopId].polyline);
          for(var item of this.busStopMarkersToDisplayOnLineClick[stopId].markers){
            this.map.removeLayer(item);
          }
        }
      }


      this.lineService.getLineByShortName(stops[0].route)
      .subscribe(line => {
        console.log('LINE ', line);
        let colorLineToDisplay = line[0].route_color;
        let myCustomColour = '';

        if(typeof this.circleIcons[colorLineToDisplay.toUpperCase()] == 'undefined'){
          myCustomColour = '#' + colorLineToDisplay;
        }
        else{
          myCustomColour = colorLineToDisplay;
        }

        console.log(line[0]);
        console.log('color ', myCustomColour);

          const markerHtmlStyles = `
              background-color: ${myCustomColour};
              width: 13px;
              height: 13px;
              display: block;
              position: relative;
              border-radius: 13px 13px;
              margin: 6px;`;

          const markerHtmlStylesHover = `
              background-color: ${myCustomColour};
              width: 26px;
              height: 26px;
              display: block;
              position: relative;
              border-radius: 13px 13px;`;

          const leafIcon = L.divIcon({
            className: "my-custom-pin",
            // labelAnchor: [-6, 0],
            popupAnchor: [0, -36],
            html: `<div style="${markerHtmlStyles}" />`
          });

          const leafIconHover = L.divIcon({
            className: "my-custom-pin-hover",
            // labelAnchor: [-6, 0],
            popupAnchor: [0, -36],
            html: `<div style="${markerHtmlStylesHover}" />`
          });

          console.log("OK");

              if(!this.busStopMarkersToDisplayOnLineClick.hasOwnProperty(stops[0].route)){
                this.busStopMarkersToDisplayOnLineClick[stops[0].route] = {'markers' : [], 'polylist' : Array(), 'polyline': L.polyline([])};

                stops.forEach((item, index) => {
                  const marker = new L.Marker([item.coords[0], item.coords[1]], {icon: leafIcon});

                  marker.addTo(this.map).bindPopup('Bus Stop no. '+ (index + 1) + '\n'
                    + item.name + '\n'
                    + item.coords[0] + ' : ' + item.coords[1]).openPopup();


                  marker.on('mouseover', function(event){
                    // marker.openPopup();
                    console.log("mouseover");
                    // event.target.setIcon(leafIconHover);
                      event.target.getElement().style.width = '24px';
                      event.target.getElement().style.height = '24px';
                    this.setIcon(leafIconHover);
                  });

                  marker.on('mouseout', function(event){
                    // marker.openPopup();
                    console.log("mouseout");
                    // event.target.setIcon(leafIcon);
                    this.setIcon(leafIcon);
                  });

                  this.busStopMarkersToDisplayOnLineClick[item.route].markers.push(marker);

                  this.busStopMarkersToDisplayOnLineClick[item.route].polylist.push(marker.getLatLng());
                });


                this.busStopMarkersToDisplayOnLineClick[stops[0].route].polyline = L.polyline(this.busStopMarkersToDisplayOnLineClick[stops[0].route].polylist,{color: myCustomColour}).addTo(this.map);
              }
      });
    }
  }

  configureMap() {
    this.myRenderer = L.canvas({ padding: 0.5 });
    this.map = L.map(this.mapContainer.nativeElement, {
      zoomControl: false,
      minZoom: 4,
      maxZoom: 18,
      layers: [this.baseMaps.Esri],
      drawControl: false,
      renderer: this.myRenderer
    }).setView(L.latLng(this.options.centerLocation.lat, this.options.centerLocation.lng), 12)
      .on('click', this.onMapClick.bind(this));


    this.drawItems = new L.FeatureGroup();
    // Initialise the draw control and pass it the FeatureGroup of editable layers

    const drawOptions = {
       polyline: false,
       rectangle: false,
       circlemarker: false,
       polygon: this.options.polygon,
       circle: this.options.circle,
       marker: this.options.marker
    };

    /*
    if (null != this.leafletDrawDirective.getDrawControl()) {
      // Do stuff with the draw control
    }
    */

    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: this.drawItems
      },
      draw: ( drawOptions as L.Control.DrawOptions )
    });

    L.control.zoom({ position: 'topright' }).addTo(this.map);
    L.control.layers(this.baseMaps).addTo(this.map);
    L.control.scale().addTo(this.map);

    this.map.addLayer(this.drawItems);
    if (this.options.editing) {
      this.map.addControl(drawControl);
    }
    if (this.options.search_bar) {
      const searchControl = new GeoSearchControl({
        provider: this.provider,                               // required
        showMarker: true,                                   // optional: true|false  - default true
        showPopup: false,                                   // optional: true|false  - default false
        marker: {                                           // optional: L.Marker    - default L.Icon.Default
          icon: new L.Icon.Default(),
          draggable: false,
        },
        popupFormat: ({ query, result }) => result.label,   // optional: function    - default returns result label
        maxMarkers: 1,                                      // optional: number      - default 1
        retainZoomLevel: false,                             // optional: true|false  - default false
        animateZoom: true,                                  // optional: true|false  - default true
        autoClose: true,                                   // optional: true|false  - default false
        searchLabel: 'Enter address',                       // optional: string      - default 'Enter address'
        keepResult: false                                   // optional: true|false  - default false
      });

      this.map.addControl(searchControl);
    }
  }

  onMapClick(e) {
    if(this.hasOwnProperty('newStopAdded')){
      const leafIcon = new L.Icon({
          shadowUrl: '/assets/marker-shadow.png',
          iconUrl: '/assets/marker-icon.png',
          iconRetinaUrl: '/assets/marker-icon-2x.png',
          iconSize: [24, 48],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          tooltipAnchor: [16, -28],
          shadowSize: [48, 48]
        });

      if (typeof this.tmpMarker !== 'undefined') {
        this.map.removeLayer(this.tmpMarker);
      }
      const marker = new L.Marker(e.latlng, {icon: leafIcon});
      marker.addTo(this.map).bindPopup('You clicked at the map at ' + e.latlng.toString()).openPopup();
      this.tmpMarker = marker;
      this.mapDataClickedEmitter.emit(e.latlng);
    }
  }

  // onMapMove(e) {
  //   if(this.hasOwnProperty('itinerariesStops')){
  //     this.teamMarker.setLatLng(this.map.getCenter());
  //   }
  // }

  handleEvents() {
    this.map.on(L.Draw.Event.CREATED, (e) => {
      console.log("event draw item created:", e)
      const ableToAddLayer = true;

      // Use this to avoid typescript type checking.
      const layer: any = (e as L.DrawEvents.Created).layer;
      const type = (e as L.DrawEvents.Created).layerType;

      const feature = layer.feature = layer.feature || {};
      feature.type = 'Feature';
      feature.properties = feature.properties || {};

      feature.properties.options = feature.properties.options || {};
      feature.properties.options = Object.assign(feature.properties.options, layer.options);

      if (ableToAddLayer) {
        this.drawItems.addLayer(layer);
        const layersGeoJson = this.drawItems.toGeoJSON();
        this.mapDataObj = L.geoJSON(layersGeoJson);
        // Save drawings to DB
        const mapdataJson = JSON.stringify(this.mapDataObj.toGeoJSON());
        this.updateMapData(mapdataJson);
      }
    });

    this.map.on('draw:deleted', (e) => {
      const layers = (e as L.DrawEvents.Deleted).layers;
      layers.getLayers().forEach(layer => {
        this.drawItems.removeLayer(layer);
      });
      const layersGeoJson = this.drawItems.toGeoJSON();
      this.mapDataObj = L.geoJSON(layersGeoJson);
      // Save drawings to DB
      const mapdataJson = JSON.stringify(this.mapDataObj.toGeoJSON());
      this.updateMapData(mapdataJson);
    });

    this.map.on(L.Draw.Event.EDITED, (e) => {
      const editedLayers = (e as L.DrawEvents.Edited).layers;
      this.drawItems.getLayers().map(layer => {
        const originalLayerId = this.drawItems.getLayerId(layer);
        const editedLayer = editedLayers.getLayer(originalLayerId);
        if (editedLayer) {
          return editedLayer;
        } else {
          return layer;
        }
      });
      const layersGeoJson = this.drawItems.toGeoJSON();
      this.mapDataObj = L.geoJSON(layersGeoJson);
      // Save drawings to DB
      const mapdataJson = JSON.stringify(this.mapDataObj.toGeoJSON());
      this.updateMapData(mapdataJson);
    });
  }

  displayDrawings() {

    // Display all drawings passed to this mapview.
    if (this.mapDataObj && this.drawItems) {
      this.mapDataObj.eachLayer((layer: any) => {
        console.log("layer :", layer);

        if (layer &&
          layer.options &&
          layer.feature &&
          layer.feature.properties &&
          layer.feature.properties.options) {
          layer.options = Object.assign(layer.options, layer.feature.properties.options);
        }

        if ((layer as L.Marker).feature.properties.userType) {
          L.Icon.Default.imagePath = (layer as L.Marker).feature.properties.markerIconsPath;

          layer.bindPopup('Popup content for user marker to be set here!');
        }
        this.drawItems.addLayer(layer);
      });
    }

  }

  clearMap() {
    if (this.drawItems) {
      this.drawItems.clearLayers();
    }
  }

  // Pass drawings to parent component of this mapview.

  updateMapData(mapdata) {
    this.mapDataChangedEmitter.emit(mapdata);
  }
}
