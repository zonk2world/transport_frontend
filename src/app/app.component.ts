import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import {LineComponent} from './components/line/line.component';
import {e} from "@angular/core/src/render3";
import {Stop} from "./classes/stop";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Datategy';
  // @Output() newStopAdded = new EventEmitter<Stop>();

  showSidebar$: Observable<boolean>;
  private defaultShowSidebar = true;

  showNavbar$: Observable<boolean>;
  private defaultShowNavbar = true;

  @ViewChild(LineComponent)
  private line: LineComponent;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    // Handle hiding sidebar for particular routes.
    this.showSidebar$ = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      mergeMap(route => route.data),
      map(data => data.hasOwnProperty('showSidebar') ? data.showSidebar : this.defaultShowSidebar),
    )

    // Handle hiding navbar for particular routes.
    this.showNavbar$ = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      mergeMap(route => route.data),
      map(data => data.hasOwnProperty('showNavbar') ? data.showNavbar : this.defaultShowNavbar),
    );

    /*
    mapClicked(event: any){

    }
    */
  }

  /*
  onStopAdded(stop: Stop) {
    console.log(stop);
  }
  */
}
