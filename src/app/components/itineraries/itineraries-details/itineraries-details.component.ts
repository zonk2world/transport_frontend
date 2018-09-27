import { Component, OnInit } from '@angular/core';
import { ItinerariesService } from '../../../services/itineraries.service';
import { DatePipe } from '../../../../../node_modules/@angular/common';
import { Itinerary } from '../../../models/itinerary';
import * as moment from 'moment';

@Component({
  selector: 'app-itineraries-details',
  templateUrl: './itineraries-details.component.html',
  styleUrls: ['./itineraries-details.component.scss']
})
export class ItinerariesDetailsComponent implements OnInit {

  seletedDate: any;
  seletedShift: any;
  shifts: any[] = [];

  itineraries: Itinerary[];
  selectedItinerary: Itinerary;
  range = [];

  constructor(
    private itinerariesService: ItinerariesService,
    private datepipe: DatePipe

  ) { }

  ngOnInit() {
    this.seletedDate = new Date();
    this.getItineraries();
  }

  getItineraries() {

    let mon = this.seletedDate.getMonth() + 1;
    const day = this.datepipe.transform(this.seletedDate, 'yyyy-MM-dd');

    this.shifts = [];
    this.seletedShift = null;
    this.selectedItinerary = null;

    this.itinerariesService.getItineraries({'month':mon.toString(), 'day': day}).subscribe(data => {
      
      if (data.length) {
        this.itineraries = data;

        this.itineraries.forEach((v) => {
          this.shifts.push(v.shift);
          v.chunks[0][1].paths = JSON.parse(v.chunks[0][1].paths);
        });
      }
      console.log(this.itineraries);
    });
  }

  changeDate(event) {
    console.log(this.seletedDate);
    this.getItineraries();
  }

  changeShift(event) {
    this.selectedItinerary = this.itineraries.find((v) => v.shift == event);
  }

}
