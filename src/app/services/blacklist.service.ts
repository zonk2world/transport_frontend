import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Blacklist } from '../models/blacklist';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable()
export class BlacklistService {

  private employeeUrl = `${this.apiEndpoint}/blacklist`;
  private headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('id_token')});

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject('API_ENDPOINT') private apiEndpoint: string
  ) {
   }

  /** POST: add a new Blacklist to the server */
  addBlacklist (blacklist: Blacklist): Observable<any> {
    return this.http.post<Blacklist>(this.employeeUrl, blacklist, {headers: this.headers});
  }

  /** GET Blacklists from the server */
  getBlacklist(network:string, from: string, to: string): Observable<Blacklist[]> {

    return this.http.get<Blacklist[]>(this.employeeUrl, {headers: this.headers, params: {network, from, to}}).map(response => {
      if(!Array.isArray(response)) response = Object.values(Object.values(response)[0]);
      return response;
    });
  }
}
