import { Component, Input, Output, EventEmitter, OnInit, OnChanges, ViewChild, SimpleChanges } from '@angular/core';
import {FormControl, NgModel, Validators} from '@angular/forms';
import MapOptions from '../../../classes/MapOptions';
import { ItinerariesService } from '../../../services/itineraries.service';
import { NetworkparamsService } from '../../../services/networkparams.service';
import { TeamService } from '../../../services/team.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Team } from '../../../classes/team';
import { Blacklist } from '../../../models/blacklist';
import { Itinerary, ItineraryListItem, ShiftStatus } from '../../../models/itinerary';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-itineraries-map',
  templateUrl: './itineraries-map.component.html',
  styleUrls: ['./itineraries-map.component.css']
})
export class ItinerariesMapComponent implements OnInit {
  @Input() shifts: any[];
  @Input() blacklists: Blacklist[];

  itineraries: ItineraryListItem[];

  mapOptions = new MapOptions(true, false, false, false, false, {lat: 48.864716, lng: 2.349014});
  mapdata = '{"type": "FeatureCollection", "features": []}';

  allteams: Team[];
  teams: any[] = [];
  selectedTeams: any[] = [];
  stops: any[] = [];
  filterStops: any[] = [];
  organizedStops: any[] = [];
  selectedShift: any;
  dateControl = new FormControl(new Date());
  date: Date = new Date();

  color = ['RED', 'MAROON', 'YELLOW', 'GREEN', 'BLUE', 'OLIVE', 'PURPLE', 'SILVER', 'AQUA', 'LIME', 'GRAY', 'WHITE', 'TEAL', 'NAVY', 'FUCHSIA', 'BLACK'];

  constructor(private itinerariesService: ItinerariesService,
              private networkparamsService: NetworkparamsService,
              private datepipe: DatePipe,
              private teamService: TeamService){
    this.teamService.getTeamsByAnyParam({}).subscribe(response => {
      this.allteams = response;
    });

   }

  ngOnInit() {
    this.selectedShift = this.shifts[0];
    // this.getItineraries(this.date);
  }

  resetData(){
    this.itineraries = [];
    this.teams = [];
    this.stops = [];
    this.filterStops = [];
    this.organizedStops = [];
  }

  getItineraries(date: Date) {
    this.resetData();
    const day = this.datepipe.transform(date, 'yyyy-MM-dd');
    this.itinerariesService.getItineraries({'month':date.getMonth()+1, 'day': day}).subscribe(data => {
      this.makeItineraries(data);
      this.getData();
      this.getFilterStops(this.selectedShift);
      this.setCoordTeams();
      console.log("itineraries :", this.itineraries);
      console.log("shifts :", this.shifts);
      console.log("selected shift :", this.selectedShift);
      console.log("date :", this.date);
      console.log("teams :", this.teams);
      console.log("stops :", this.stops);
      console.log("filter Stops :", this.filterStops);
      console.log("this.organizedStops :", this.organizedStops);
    });
  }

  getData(): void {
    this.teams = [];
    this.itineraries.forEach(iti => {
      if(iti.hasOwnProperty('itineraries')){
        iti.itineraries.forEach(shift=> {
          //getTeams
          if(shift && shift['shift'] && shift['team'] && shift.team['uid']){
            this.allteams.forEach(team => {
              if(team.uid === shift.team.uid)
                this.teams.push({uid: shift.team.uid,
                                name: team.name,
                                employees: team.employees,
                                shift: shift.shift,
                                itinerary_index: this.itineraries.indexOf(iti),
                                color: this.color[this.itineraries.indexOf(iti) % this.color.length],
                                selected: true
                              });
            });
            this.selectedTeams = this.teams;
          }
          //getStops
          if(shift && shift['shift'] && shift['chunks'] && shift.chunks[0] && shift.chunks[0][1] && shift.chunks[0][1]['stops']){
          shift.chunks[0][1].stops.forEach(stop => {
            this.stops.push({itinerary_index: this.itineraries.indexOf(iti),
              name: stop.name, shift: shift.shift, latitude: stop.coords[0],
              longitude: stop.coords[1], lines: stop.lines,
              color: this.color[this.itineraries.indexOf(iti) % this.color.length],
              start: shift.chunks[0][0].start,
              end: shift.chunks[0][0].end
            });
          });
        }
        });
      }
    });

  }

  private makeItineraries(data: Itinerary[]) {
    let itineraryList: ItineraryListItem[] = [];

    data.forEach((v) => {

      const shift = this.shifts.find((s) => { return s.name == v.shift });
      if (shift) {

        // check blacklist
        const formattedDate = this.datepipe.transform(v.day, 'yyyy-MM-dd');
        const start = moment( formattedDate + ' ' + shift.start, 'YYYY-MM-DD hh:mm').toDate().getTime();
        const end = moment( formattedDate + ' ' + shift.end, 'YYYY-MM-DD hh:mm').toDate().getTime();

        const blacklist = this.blacklists.find((b) => {
          const ts = new Date(b.ts).getTime();

          if (ts >= start && ts <= end) {
            return true;
          } else {
            return false;
          }
        });

        // check if itinerary added in itinerariesList
        let item = itineraryList.find((e) => {
          return (e.day == v.day);
        }) as ItineraryListItem;

        if (item) {
          item.addItinerary(v, blacklist ? true : false);

        } else {
          itineraryList.push(new ItineraryListItem(v.day, v, blacklist ? true : false));
        }
      }
    });

    // order by shifts
    itineraryList.forEach((v) => {
      let newOrder = [];
      this.shifts.forEach((shift) => {
        let item = v.itineraries.find((e) => { return e.shift == shift['name']})
        if (item) {
          newOrder.push(item);
        }
      });

      v.itineraries = newOrder;
    });
    this.itineraries = itineraryList;
  }

  getFilterStops(shift){
    this.filterStops = this.stops.filter(stop => stop.shift === shift.name);
    this.organizedStops = this.sortStops();
  }

  sortStops(){
    let temp_stops = this.filterStops.map(stop => stop.itinerary_index);
    let stops_copy = this.filterStops;
    temp_stops.sort();
    stops_copy.sort((a,b) => a.itinerary_index - b.itinerary_index);
    let res = [];
    let last_index;
    while(temp_stops.length){
      last_index = temp_stops.lastIndexOf(temp_stops[0]);
      res.push(stops_copy.slice(0, last_index+1));
      stops_copy.splice(0, last_index+1);
      temp_stops.splice(0, last_index+1);
    }
    return res;
  }

  changeSelector(event) {
    if(!(event instanceof Date)){
      if(event.start)
        this.selectedShift = event;
    }
    this.getItineraries(this.date);
  }

  changeTeamSelector(event) {
    this.selectedTeams = event;
  }

  setCoordTeams(){
    this.selectedTeams.forEach(team => {
      let latbar = 0, longbar = 0;
      this.organizedStops[team.itinerary_index].forEach(stop => {
        latbar = latbar + stop.latitude;
        longbar = longbar + stop.longitude;
      });
      latbar = latbar / this.organizedStops[team.itinerary_index].length;
      longbar = longbar / this.organizedStops[team.itinerary_index].length;
      team.latitude = latbar;
      team.longitude = longbar;
    });
  }

}
