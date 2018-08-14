import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Stop} from "../classes/stop";

@Injectable({
  providedIn: 'root'
})
export class StopService {
  private linesUrl = `${this.apiEndpoint}/stops`;
  private headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('id_token')});

  constructor(
    private http: HttpClient,
    @Inject('API_ENDPOINT') private apiEndpoint: string
  ) { }

  getStops(values): Observable<Stop[]>{
    const url = `${this.linesUrl}/getStops`;
    console.log('stop ids')
    // console.log(stopIds);
    console.log(url);
    // console.log(JSON.stringify(stopIds));

    return this.http.get<any[]>(url, {headers: this.headers, params:
        values}).map(response => {
      // if(!Array.isArray(response)) response = Object.values(Object.values(response)[0]);
      return response.map(x => {
        return x;
      });
    });
  }
}

