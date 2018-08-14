import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Employee } from '../classes/employee';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Itinerary } from '../models/itinerary';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};


@Injectable()
export class ItinerariesService {
  private itineraryUrl = `${this.apiEndpoint}/itinerary`;
  private headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('id_token')});

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject('API_ENDPOINT') private apiEndpoint: string
  ) { }

  getItineraries(params: any): Observable<any[]> {
    return this.http.get<any[]>(this.itineraryUrl, {headers: this.headers, params: params}).map(response => {
      if(!Array.isArray(response)) response = Object.values(Object.values(response)[0]);
      return response.map(x => {
        return x;
      });
    });
  }
  
  updateItinerary(itinerary: Itinerary): Observable<any> {
    return this.http.put<Itinerary>(this.itineraryUrl, itinerary, {headers: this.headers});
  }

  creatItinerary(itinerary: Itinerary): Observable<any> {
    return this.http.post<Itinerary>(this.itineraryUrl, itinerary, {headers: this.headers});
  }
}
