import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Line } from '../classes/line';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Stop} from "../classes/stop";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class LineService {
  private linesUrl = `${this.apiEndpoint}/line`;
  private headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('id_token')});

  constructor(
    private http: HttpClient,
    @Inject('API_ENDPOINT') private apiEndpoint: string
  ) { }

  getStopIdsByLineName(route_short_name, route_long_name): Observable<string[]>{
    // const url = `${this.linesUrl}?route_short_name=${route_short_name}?destination=${destination}`;
    const url = `${this.linesUrl}`;
    /*
    return  this.http.get<Stop[]>(url, {headers: this.headers})
      .map(response => {
        return response.map(x => new Stop(x.name, x.latitude, x.longitude, x.route, x.network, x.position));

        new Line(x.network, x.route_short_name, x.route_color, x.route_long_name,
        x.route_text_color, x.route_type, x.uid));

      });
    */

    return this.http.get<string[]>(`${url}/stopIds`, {headers: this.headers, params:
        {route_short_name: route_short_name, route_long_name: route_long_name}}).map(response => {
      // if(!Array.isArray(response)) response = Object.values(Object.values(response)[0]);
      return response.map(x => {
        console.log("LOUBI");
        console.log(x);
        return x;
      });
    });
  }

  /** GET Lines from the server */
  getLines(): Observable<Line[]> {
    return  this.http.get<Line[]>(this.linesUrl, {headers: this.headers})
      .map(response => {
        return response.map(x =>
        new Line(x.network, x.route_short_name, x.route_color, x.route_long_name,
        x.route_text_color, x.route_type, x.uid));
      });
  }

  getLinesByName(route_long_name): Observable<Line[]> {
    const url = `${this.linesUrl}?route_long_name=${route_long_name}`;
    return  this.http.get<Line[]>(url)
      .map(response =>
        response.map(x =>
        new Line(x.network, x.route_short_name, x.route_color, x.route_long_name,
        x.route_text_color, x.route_type, x.uid) ));
  }

  getLineByShortName(route_short_name): Observable<Line> {
    const url = `${this.linesUrl}/getLineByShortName`;
    return this.http.get<Line>(url, {headers: this.headers, params:
        {network: 'TICE', route_short_name: route_short_name}});
  }

  /** PUT: update the Line on the server */
  updateLine (line: Line): Observable<any> {
    return this.http.put<Line>(this.linesUrl, line, httpOptions);
  }

  /** POST: add a new Line to the server */
  addLine (line: Line): Observable<Line> {
    console.log('addline service', line);
    return this.http.post<Line>(this.linesUrl, line, {headers: this.headers});
  }

  // /** DELETE: delete the Line from the server */
  // deleteLine (line: Line | string): Observable<Line> {
  //   const id = typeof line === 'string' ? line : line.id;
  //   const url = `${this.linesUrl}?id=${id}`;
  //
  //   return this.http.delete<Line>(url, httpOptions);
  // }

  /** GET Lines filtered by name_en */
  searchByName(route_long_name: string): Observable<Line[]> {
    return  this.http.get<Line[]>(`${this.linesUrl}`,
      {params: {route_long_name: route_long_name}});
  }

  updateStopIds(obj): Observable<any>{
    const url = `${this.linesUrl}/updateStopIds`;
    return this.http.post<any>(url, obj, {headers: this.headers});
  }
  // for get lines with stop_list
  getLinesTemp(): Observable<any[]> {
    return  this.http.get<any[]>(this.linesUrl, {headers: this.headers});
  }
}
