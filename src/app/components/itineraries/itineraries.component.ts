import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ItinerariesService } from '../../services/itineraries.service';
import { TeamService } from '../../services/team.service';
import { Team } from '../../classes/team';
import { Itinerary, ItineraryListItem, ShiftStatus } from '../../models/itinerary';
import { NetworkparamsService } from '../../services/networkparams.service';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { BlacklistService } from '../../services/blacklist.service';
import { Blacklist } from '../../models/blacklist';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material';
import { AlertDialogComponent } from '../alertdialog/alertdialog.component';
import { ToastrService } from 'ngx-toastr';
import { LineService } from '../../services/line.service';
import { Line } from '../../classes/line';

class LineTemp {
  network: string;
  route_short_name: string;
  route_color: string;
  route_long_name: string;
  route_text_color: string;
  route_type: string;
  uid: string;
  stop_list: string[];
}

@Component({
  selector: 'app-itineraries',
  templateUrl: './itineraries.component.html',
  styleUrls: ['./itineraries.component.css']
})

export class ItinerariesComponent implements OnInit {

  ShiftStatus = ShiftStatus;

  displayedColumns = ['day', 'date'];
  displayedMonths: any[] = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  itineraries: ItineraryListItem[];
  selectedItinerary: ItineraryListItem;
  isSelectedItinerary: boolean;
  selectedDay: Date;
  selectedMonth: Date;

  isshowAlert: boolean;
  currentDate = new FormControl(new Date());
  teams: Team[] = [];
  selectedTeam = [];
  shifts: any[] = [];

  blacklistForm: FormGroup;

  blacklists: Blacklist[];

  // lines: Line[];
  lines: LineTemp[];
  stoplist: string[];

  constructor(
    private itinerariesService: ItinerariesService,
    private teamService: TeamService,
    private networkparamsService: NetworkparamsService,
    private blacklsitService: BlacklistService,
    private datepipe: DatePipe,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private lineService: LineService
  ) {}

  ngOnInit() {

    // init months
    this.displayedMonths = this.displayedMonths.map(function(v, index, array){
      let send_date = new Date();
      return new Date(send_date.setMonth(send_date.getMonth() + index));
    });
    this.selectedMonth = this.displayedMonths[0];

    // get shifts & itineraries
    const user = localStorage.getItem('user');
    let mon = this.selectedMonth.getMonth() + 1;
    this.itineraries = [];
    this.blacklists = [];
    const from = this.datepipe.transform(new Date().setDate(1), 'yyyy-MM-dd');
    const to = this.datepipe.transform(new Date().setDate(31), 'yyyy-MM-dd');

    forkJoin (
      this.itinerariesService.getItineraries({'month': mon.toString()}),
      this.networkparamsService.getNetworkparams(JSON.parse(user).network),
      this.blacklsitService.getBlacklist(JSON.parse(user).network, from, to),
      this.lineService.getLinesTemp()
    ).subscribe( data => {
      const [itineraries, networkparams, blacklists, lines] = data;
      console.log(data);
      if (networkparams.length) {
        this.shifts = networkparams[0]['shifts'];
        this.shifts.forEach((v) => {
          this.displayedColumns.push(v['name']);
        });
      }
      this.displayedColumns.push('action');
      this.blacklists = blacklists;
      this.lines = lines;
      this.makeItineraries(itineraries);
    });

    this.initBlacklistForm();
  }

  private initBlacklistForm() {
    this.blacklistForm = new FormGroup({
      startdate: new FormControl(new Date()),
      starttime: new FormControl(),
      line: new FormControl(),
      station: new FormControl(),
      expecteddate: new FormControl(new Date()),
      expectedtime: new FormControl(),
      description: new FormControl('')
    });
  }

  private isIncludedBlacklist(itinerary: Itinerary) {

    const formattedDate = this.datepipe.transform(itinerary.day, 'yyyy-MM-dd');
    const starttime = itinerary.chunks[0][0].start;
    const endtime = itinerary.chunks[0][0].end;
    const start = moment( formattedDate + ' ' + starttime, 'YYYY-MM-DD hh:mm:ss').toDate().getTime();
    const end = moment( formattedDate + ' ' + endtime, 'YYYY-MM-DD hh:mm:ss').toDate().getTime();

    let paths = JSON.parse(itinerary.chunks[0][1].paths);
    const blacklist = this.blacklists.find((b) => {
      const ts = new Date(b.ts).getTime();

      if (ts >= start && ts <= end) {
        // check line & stops
        let routes = Object.keys(paths)[0];
        if (routes) {
          routes = paths[routes];
          const shift = Object.keys(routes).find((v) => v == itinerary.shift);
          if (shift) {
            let shift_route = routes[shift];

            return Object.keys(shift_route).find((key) => {
              const line = shift_route[key];
              return Object.keys(line).find((stop_point) => {
                const stop = line[stop_point];
                stop.lines = stop.lines == '' ? [] : stop.lines;
                const findLine = stop.lines.find(v => v == b.line);
                const findStop = stop.path.includes(b.stoppoint);
                return findLine && findStop ? true: false;
              }) ? true : false;
            }) ? true: false;
          }
        }
      } 
      return false;
    });

    return blacklist;
  }

  private makeItineraries(data: Itinerary[]) {
    let itineraryList: ItineraryListItem[] = [];

    data.forEach((v) => {

      const shift = this.shifts.find((s) => { return s.name == v.shift });
      if (shift) {

        // check blacklist
        const blacklist = this.isIncludedBlacklist(v);
        
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
    })

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
  
  private getItineraries(month: Date) {
    let mon = month.getMonth() + 1;
    this.itinerariesService.getItineraries({'month': mon.toString()}).subscribe(data => {
      this.makeItineraries(data);
    });
  }

  addTeam(itinerary): void {
    if (!itinerary.itineraries.length) {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: {title: 'Alert', message: 'There is no itinerary. Please create a new itinerary'}
      });
      return;
    }

    this.selectedItinerary = itinerary;
    this.selectedTeam = new Array(this.selectedItinerary.itineraries.length);
    this.selectedItinerary.itineraries.forEach((v, index) => {
      if (v.team && v.team.uid) {
        this.selectedTeam[index] = v.team;
      }
    });
    this.isSelectedItinerary = true;
    this.selectedDay = itinerary.day;
    this.getTeams();

    // reset form for add alert
    
    this.blacklistForm.reset(
      {
        startdate: new Date(),
        starttime: '',
        line: '',
        station: '',
        expecteddate: new Date(),
        expectedtime: '',
        description: ''
      }
    );
  }

  getTeams(): void {
    const user = localStorage.getItem('user');
    console.log(this.selectedDay);
    this.teamService.getTeams(JSON.parse(user).network, this.selectedDay.toString()).subscribe(teams => {
      this.teams = teams;
      console.log(this.teams);
    });
  }

  isShownTeam(team) {
    let t = this.selectedTeam.find((v: Team) => {
      if (v) {
        return v.uid == team.uid;
      } else {
        return false;
      }
    });
    if (t) {
      return false;
    }
    return true;
  }

  changeTeam(event, index) {
    this.selectedTeam[index] = event;
    this.selectedItinerary.itineraries[index].team = (typeof event !==  'undefined') ? event : '';
    // update team on itinerary
    this.itinerariesService.updateItinerary(this.selectedItinerary.itineraries[index]).subscribe(data => {
      this.toastr.success('Successfully team is assigned!', 'Success!');
      this.getItineraries(this.selectedMonth);
    });
  }

  changeMonth(event) {
    this.selectedMonth = event as Date;
    this.isSelectedItinerary = false;
    this.selectedItinerary = null;
    // this.getItineraries(this.selectedMonth);
    this.getBlacklists();
  }

  private getBlacklists() {
    const today = new Date();
    const from = this.datepipe.transform(new Date(today.getFullYear(), this.selectedMonth.getMonth(), 1), 'yyyy-MM-dd');
    const to = this.datepipe.transform(new Date(today.getFullYear(), this.selectedMonth.getMonth() + 1, 0), 'yyyy-MM-dd');
    const user = localStorage.getItem('user');
    this.blacklsitService.getBlacklist(JSON.parse(user).network, from, to).subscribe((res)=> {
      this.blacklists = res;
      this.getItineraries(this.selectedMonth);
    });
  }

  addBlacklist() {
    if (this.blacklistForm.valid) {
      let formValue = this.blacklistForm.value;

      let observable = [];

      const user = localStorage.getItem('user');

      let formattedDate = this.datepipe.transform(formValue.startdate, 'yyyy-MM-dd');
      let startdate = moment( formattedDate + ' ' + formValue.starttime, 'YYYY-MM-DD hh:mm');
      formattedDate = this.datepipe.transform(formValue.expecteddate, 'yyyy-MM-dd');
      let expecteddate = moment( formattedDate + ' ' + formValue.expectedtime, 'YYYY-MM-DD hh:mm');
      
      for (let day = startdate; day <= expecteddate; day.add(1, 'hours')) {

          let blacklist = new Blacklist();
          blacklist.network = JSON.parse(user).network;
          blacklist.name = JSON.parse(user).username;
          blacklist.reportdate = new Date().toString();
          blacklist.stoppoint = formValue.station;
          blacklist.line = formValue.line;
          blacklist.station = formValue.station;
          blacklist.description = formValue.description;
          blacklist.ts = day.toString();
          observable.push(this.blacklsitService.addBlacklist(blacklist));
      }

      if (observable.length) {
        forkJoin(observable).subscribe((res) => {
          console.log(res);
          this.toastr.success('Successfully new blacklist is created!', 'Success!');
          this.getBlacklists();
        });
      }
    }
      
  }

  changeLine(event) {
    console.log(event);
    const line = this.lines.find((v) => (v.route_short_name == event));
    this.stoplist = line.stop_list ? line.stop_list : null;
  }
}

