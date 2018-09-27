import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Itinerary } from '../../../../models/itinerary';
import * as moment from 'moment';

const REAL_STATION_NAME = 'evry courcouronnes centre';
const MORNING_BREAKE_TIME = 15; // min
const LUNCH_BREAKE_TIME = 60; // min
const EVENING_BREAKE_TIME = 15; // min
const AFTER_EVENING_BREAKE_TIME = 15; // min

enum RouteType{
  Vehicle = 0,
  Foot,
  Pause
}

class Line {
  name: string;
  stops: string[];
}

class Route {
  start: number;
  end: number;
  type: RouteType;
  line: Line;
}

@Component({
  selector: 'app-itinerary-timeline',
  templateUrl: './itinerary-timeline.component.html',
  styleUrls: ['./itinerary-timeline.component.scss']
})
export class ItineraryTimelineComponent implements OnInit, OnChanges {

  hours = [];
  RouteType = RouteType;
  routes: Route[];
  timelineStart: number;
  
  @Input() itinerary : Itinerary;

  constructor() { }

  ngOnInit() {
    this.makeRoutePoint();
  }
  private makeRoutePoint() {
    const stops = this.itinerary.chunks[0][1].stops;
    const fake_stops = stops.filter((s) => {
      return s.name == REAL_STATION_NAME;
    });
    this.routes = [];
    this.timelineStart = 6;
    let timelineEnd = 24;

    let station_cnt = 0;
    let stops_name = [];
    stops.forEach((stop) => {
      if (stop.name == REAL_STATION_NAME) {

        let time = moment(stop.arrival_time, 'HH:mm:ss');
        let start = time.hours() * 60 + time.minutes();
        time = moment(stop.departure_time, 'HH:mm:ss');
        let end = time.hours() * 60 + time.minutes();

        if (station_cnt !== 0) {
          const route = this.routes[this.routes.length - 1];
          let line = new Line();
          line.name = 'Part ' + station_cnt;
          line.stops = stops_name.slice(0);
          if (line.stops.length == 0) {
            line = null;
          }
          this.routes.push(
            {
              start: route.end,
              end: start,
              type: RouteType.Vehicle,
              line: line 
            }
          );

        } else {
          this.timelineStart = Math.floor(end / 60) - 1;
        }
        // break route
        this.routes.push(
          {
            start: start,
            end: end,
            type: RouteType.Pause,
            line: null 
          }
        );
        
        station_cnt++;
        stops_name = [];
      } else {
        // stops
        if(!stops_name.find((v) => v == stop.name)) {
          stops_name.push(stop.name);
        }
      }
    });
    // remove first break and last break
    if (this.routes.length) {
      this.routes = this.routes.slice(1);
      const lastbreak = this.routes.pop();
      let last = this.routes[this.routes.length - 1];
      last.end = lastbreak.end;
      timelineEnd = Math.floor(last.end / 60) + 1;
    }
    console.log(this.routes);
    // make time line axis
    this.hours = [];
    for (let i = this.timelineStart; i <= timelineEnd; i++) {
      let label = '';
      let label1 = '';
      if (i < 10) {
        label = '0' + i + ':00';
        label1 = '0' + i + ':30';
      } else {
        label = i + ':00';
        label1 = i + ':30';
      }
      this.hours.push({label, value: i, color: i % 3});
      if (i != timelineEnd) {
        this.hours.push({label1, value: -1});
      }
    }
  }
  ngOnChanges() {
    if (this.itinerary) {

      // this.itinerary.chunks[0][1].paths = JSON.parse(this.itinerary.chunks[0][1].paths);
      console.log(this.itinerary);
      this.makeRoutePoint();
    }
    
  }
  addPadding(i) {
    const route = this.routes[i];
    let style = {
      'width.px': 140 * (route.end - route.start) / 60
    }  
    if (i == 0 ) {
      style['margin-left.px'] =  140 * (route.start - this.timelineStart * 60) / 60;
    }
    return style;
  }
  calculateStyles(i, colorStyle = false) {
    const route = this.routes[i];
    let style = {
      'width.px': 140 * (route.end - route.start) / 60
    }    
    if (colorStyle) {
      if (route.type == RouteType.Pause) {
        style['color'] = '#33404a';
      } else {
        style['color'] = '#25aae1';
      }
    }
    return style;
  }
  calculateDuration(i) {
    const route = this.routes[i];
    const time = route.end - route.start;
    const h = Math.floor(time / 60);
    const min = time % 60;

    return (h ? h + 'h' : '') + (min ? (h ? ':' + min + 'm' : min + 'm') : ''); 
  }
}
