import {Component, OnInit, ViewChild, Renderer2, Output, EventEmitter, Input} from '@angular/core';
import {MatSort, MatTableDataSource, MatPaginator, MatInput} from '@angular/material';
import {FormControl} from '@angular/forms';
import {Line} from '../../classes/line';
import { LineService } from '../../services/line.service';
import {DragulaService} from 'ng2-dragula';
import {Stop} from '../../classes/stop';
import MapOptions from '../../classes/MapOptions';
import {SelectionModel} from "@angular/cdk/collections";
import {LineModalComponent} from "../line-modal/line-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MatRadioModule} from "@angular/material/radio";
import {StopService} from "../../services/stop.service";
import {Observable} from "rxjs/Observable";
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import "rxjs-compat/add/observable/forkJoin";


/**
 * @title Table with sorting
 */
@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.css']
})
export class LineComponent implements OnInit {
  mapOptions = new MapOptions(true, false, false, false, false, {lat: 48.864716, lng: 2.349014});
  mapdata = '{"type": "FeatureCollection", "features": []}';
  // mapdata = {"busStops": []};
  highlightedRows = [];
  selection = new SelectionModel<Line>(false, null);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = [
    'route_short_name',
    'route_long_name',
    'route_type'
  ];
  dataSource: MatTableDataSource<Line>;
  stopsToDisplay: Stop[] = [];
  stopIds: string[] = [];
  alllines: Line[] = [];
  lines: Line[] = [];
  newLine: Line;
  namesCtrl: FormControl;
  filteredLinesByName: Line[] = [];
  names: string[] = [];
  nameToSearch = '';
  types: string[]  = [
    'tramway',
    'metro',
    'train',
    'bus',
    'ferry',
    'cable car on rail',
    'cable car',
    'funicular'
  ];
  newStop: Stop;
  newStopAdded: Stop;
  allstops: Stop[] = [];
  colorLineToDisplay: string = '';
  // backAndForth = ['forth', 'back'];

  items = [];

  Control: FormControl = new FormControl();


  constructor(private lineService: LineService, private stopService: StopService, private renderer: Renderer2, private dragula: DragulaService,
              private modalService: NgbModal) {
    this.dataSource = new MatTableDataSource<Line>(null);

    this.dragula.drag.subscribe((value1) => {
      console.log('drag');
    });

    this.dragula.drop.subscribe( (value2) => {
      console.log(value2.after);
      this.items[value2.index] = value2.index;
      // [].slice.call(el.parentElement.children).indexOf(el);
    });


  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource = new MatTableDataSource<Line>(null);
    this.newLine = new Line();
    this.newStop = new Stop();
    this.getLines();
    this.namesCtrl = new FormControl();
    this.changeNamesCtrl();
    this.dragula.setOptions('items', {
      revertOnSpill: true
    });
  }

  highlightRow(row){
    if(this.highlightedRows.length > 0){
      this.highlightedRows.pop();
    }
    this.highlightedRows.push(row);
    console.log(row);
    // this.openLineModal();

    this.getStopIds(row.route_short_name, row.route_long_name);

    /*
    console.log(row);
    this.selectedRowIndex = row.id;
    console.log(this.selectedRowIndex);
    */
  }

  openLineModal() {
    const modalRef = this.modalService.open(LineModalComponent);

    modalRef.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }

  changeNamesCtrl(): void {
    this.namesCtrl.valueChanges.subscribe(name => {
      this.filteredLinesByName = this.searchByName(name);
      if (!this.isEmpty(this.filteredLinesByName)) {
        for (const array of this.filteredLinesByName) {
          if (array.route_long_name != '') { this.names.push(array.route_long_name); }
        }
        this.names = this.removeDuplicates(this.names);
      } else {
        this.names = [];
      }
    });
  }

  searchByName(name: string = ''): Line[] {
    const res: Line[] = [];
    if (this.alllines) {
      for (const line of this.alllines) {
        if (line.route_long_name.includes(name)) {
          res.push(line);
        }
      }
    }
    return res;
  }

  removeDuplicates(arr) {
    const unique_array = [];
    for (let i = 0; i < arr.length; i++) {
        if (unique_array.indexOf(arr[i]) == -1) {
            unique_array.push(arr[i]);
        }
    }
    return unique_array;
  }

  getLines(): void {
    this.lineService.getLines()
      .subscribe(lines => {
        console.log(lines);
        this.alllines = lines;
        this.featchMatTable(this.alllines);
      });
  }

  getStopIds(route_short_name, destination): void {
    this.stopsToDisplay = [];


        this.lineService.getStopIdsByLineName(route_short_name, destination)
          .subscribe(stopIds => {
            console.log('stop ids front');
            console.log(stopIds);
            // let stopsToDisplay = [];
            let observables = [];
            if(stopIds[0]["stop_list"] !== null){
              for(let e of stopIds[0]["stop_list"]){
                // this.stopService.getStops(stopIds[0])
                observables.push(this.stopService.getStops({network: 'TICE', route: route_short_name, stoppoint: e}));
              }
              Observable.forkJoin(observables).subscribe(
                (result) => {
                  result.forEach((data) => {
                    // setupBuilds(this.apps,data.url,data._body);
                    console.log(data);
                    this.stopsToDisplay.push(data[0]);
                  });
                  console.log(this.stopsToDisplay);
                  this.stopsToDisplay = this.stopsToDisplay.slice();
                }
              );
            }
          });
  }

  featchMatTable(lines: Line[]): void {
    console.log(lines);
    // Assign the data to the data source for the table to render
    const namesToDisplay = lines.map(line => {
      const cline = Object.assign({}, line);
      return cline;
    });

    this.dataSource = new MatTableDataSource(namesToDisplay);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  addLine() {
    if(this.newStop.name != ''){
        console.log('allstops', this.allstops);
        this.newLine.stops = this.allstops;
        this.lineService.addLine(this.newLine)
          .subscribe(line => {
            this.getLines();
          });
        this.newLine = new Line();

        let newStopX = new Stop('',-1,-1, this.newStop.route, '', -1);

        // Transmit newStop to mapview component
        this.newStopAdded = newStopX;
    }
    else{
      alert('You need to add bus stops to this line');
    }
  }

  search() {
    const res: Line[] = [];
    if (this.alllines) {
      for (const line of this.alllines) {
        if (line.route_long_name.includes(this.nameToSearch)) {
          res.push(line);
        }
      }
    }
    if (!this.isEmpty(res)) {
      this.featchMatTable(res);
    } else {
      window.alert('No result found!');
    }
  }

  addStop() {
    if(this.newLine.route_short_name != '' && this.newLine.network != '' && this.newStop.name != ''){
      this.newStop.route = this.newLine.route_short_name;
      this.newStop.network = this.newLine.network;
      this.newStop.position = (this.items.length + 1);
      this.items.push(this.newStop.position + ' ' + this.newStop.name);

      let newStopX = new Stop(this.newStop.name, this.newStop.latitude, this.newStop.longitude,
          this.newStop.route, this.newStop.network);

      this.allstops.push(newStopX);
      console.log('addline', this.allstops);

      // Transmit newStop to mapview component
      this.newStopAdded = newStopX;
    }
    else{
      // this.Control.setErrors({'mismatch': true});
      window.alert("You must specify the line's network, line number and the bus stop's name");
    }
  }



  // delete(line: Line): void {
  //   if (window.confirm('Are sure you want to delete this item ?')) {
  //     this.lineService.deleteLine(line).subscribe(result => {
  //       const index = this.alllines.map(item => item.id).indexOf(line.id);
  //       if (index > -1) {
  //         this.alllines.splice(index, 1);
  //         this.getLines();
  //       }
  //     });
  //   }
  // }

  onBusStopMapDataChanged(mapdataX) {
    console.log(mapdataX);
    this.newStop.latitude = mapdataX.lat;
    this.newStop.longitude = mapdataX.lng;
  }

  isEqual(a, b) {
    for (const i in a) {
      if (a[i] != b[i]) {
        return false;
      }
    }
    for (const i in b) {
      if (b[i] != a[i]) {
        return false;
      }
    }
    return true;
  }

  isEmpty(arg) {
    for (const item in arg) {
      return false;
    }
    return true;
  }
}
