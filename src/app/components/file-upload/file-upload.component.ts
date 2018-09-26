import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {LineService} from "../../services/line.service";
import {FileUploadService} from "../../services/file-upload.service";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  loading1: boolean = false;
  loading2: boolean = false;
  csv: string = '';

  constructor(private fileUploadService: FileUploadService,
              private lineService: LineService){}

  fileUpload(event, fileType) {
    const me = this;
    // console.log(event.srcElement);

    const reader = new FileReader();
    reader.readAsText(event.srcElement.files[0]);

    reader.onload = function () {
      me.csv = reader.result;
      let allTextLines = me.csv.split(/\r|\n|\r/);
      let headers = allTextLines[0].split(',');
      let lines = [];
      // let json = {};

      for (let i = 0; i < allTextLines.length; i++) {
        // split content based on comma
        let data = allTextLines[i].split(',');
        if (data.length === headers.length) {
          let tarr = [];
          for (let j = 0; j < headers.length; j++) {
            tarr.push(data[j]);
          }

          lines.push(tarr);
        }
      }
      // all rows in the csv file
      console.log(">>>>>>>>>>>>>>>>>", lines);
      // console.log(">>>>>>>>>>>>>>>>>", json);

      switch(fileType){
        case 'route': {
          me.fileUploadService.createRoutes(lines)
            .subscribe(result => {
              console.log("Routes created", result);
            });
          break;
        }

        case 'stopTimes': {
          me.fileUploadService.createStopTimes(lines)
            .subscribe(result => {
              console.log("Stop Times created", result);
            });
          break;
        }
      }
    }
  }

  updateDB(){
    this.lineService.getLines()
      .subscribe(lines => {
        console.log(lines);
        let observables = [];
        let stopTimes = [];
        lines.forEach(line =>{
          // stopTimes[line.route_short_name] = {};
          stopTimes.push({'route_short_name': line.route_short_name, '0': [], '1': []}); //[line.route_short_name][dest] = [];
          [0, 1].forEach((dest, index) =>{
            observables.push(this.fileUploadService.getStopIndices('TICE', line.route_short_name, dest));
          });
        });
        Observable.forkJoin(observables).subscribe((result) => {
          console.log(result);
          console.log(stopTimes);
          let j = 0;
          result.forEach((item, index) => {
            console.log('index ', index);
            console.log('item ', item);

            if(index%2 == 0){
              if(item.length > 0) {
                  stopTimes[j][item[0].direction_id.toString()].push(item);
              }
            }
            else{
              if(item.length > 0) {
                  stopTimes[j][item[0].direction_id.toString()].push(item);
              }
              j++;
              console.log(j);
            }
          });

          console.log(stopTimes);
          let count_trip_id = {};
          let final_count = {};

          stopTimes.forEach(line => {
            this.destFunc(count_trip_id, line, '0');
            this.destFunc(count_trip_id, line, '1');
          });

          this.deleteFunc(final_count, count_trip_id, '0', true);
          this.deleteFunc(final_count, count_trip_id, '1', false);

          console.log(final_count);

          this.cleanFunc(final_count);

          console.log(final_count);

          let observables2 = [];
          let res = [];
          Object.keys(final_count).forEach(key => {
            res.push({network: 'TICE', route_short_name: key, stop_points: []});
            if(final_count[key].hasOwnProperty('0')){
              observables2.push(this.fileUploadService.getTimesByTripId('TICE', key, final_count[key]['0'].id, '0'));
            }
            else if(final_count[key].hasOwnProperty('1')){
              observables2.push(this.fileUploadService.getTimesByTripId('TICE', key, final_count[key]['1'].id, '1'));
            }
          });

          Observable.forkJoin(observables2).subscribe((result) => {
            console.log(result);
            result.forEach((val, idx) => {
              res[idx].stop_points = val;
            });
            console.log(res);
            this.lineService.updateStopIds(res).subscribe(result => {
              console.log(result);
            });
          });
        })
      });
  }

  destFunc(count_trip_id, line, idx){
      if(typeof line[idx] !== 'undefined'){
          if(typeof line[idx][0] !== 'undefined'){
            let id = line.route_short_name;
            if(typeof count_trip_id[id] == 'undefined'){
              count_trip_id[id] = {'0': [], '1': []};
            }
            let currentId = '';
            line[idx][0].forEach((timeStop) => {
              if(currentId !== timeStop.trip_id){
                currentId = timeStop.trip_id;
                count_trip_id[id][idx].push({'trip_id': currentId, 'count': 0});
              }
              count_trip_id[id][idx][count_trip_id[id][idx].length - 1].count++;
            });
          }
        }
  }

  deleteFunc(final_count, count_trip_id, idx, init){
    for(let item in count_trip_id){
            if(init){
              final_count[item] = {'0': {'id': '', 'count': 0}, '1': {'id': '', 'count': 0}};
            }
            let max_count = 0;
            let id_max = -1;
            let idx_tmp;
            count_trip_id[item][idx].forEach((item2, index) => {
              if(item2.count > max_count){
                max_count = item2.count;
                id_max = item2.trip_id;
                final_count[item][idx]['id'] = item2.trip_id;
                final_count[item][idx]['count'] = item2.count;
              }
            });
          }
  }

  cleanFunc(final_count){
    console.log(final_count);

    Object.values(final_count).forEach(val => {
      if(val['0'].count > val['1'].count){
        delete val['1'];
      }
      else{
        delete val['0'];
      }
    });

  }

  onSubmitRoute() {
    this.loading1 = true;
    // this.http.post('apiUrl', formModel)
    setTimeout(() => {
      // FormData cannot be inspected (see "Key difference"), hence no need to log it here
      this.loading1 = false;
      alert('done!');
    }, 1000);
  }

  onSubmitStopTimes() {
    this.loading2 = true;
    // this.http.post('apiUrl', formModel)
    setTimeout(() => {
      // FormData cannot be inspected (see "Key difference"), hence no need to log it here
      this.loading2 = false;
      alert('done!');
    }, 1000);
  }
}
