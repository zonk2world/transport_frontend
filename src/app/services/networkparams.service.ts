import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { NetworkParam } from '../models/shift';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable()
export class NetworkparamsService {
  private networkparamsUrl = `${this.apiEndpoint}/networkparams`;
  private headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('id_token')});

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject('API_ENDPOINT') private apiEndpoint: string
  ) { }

  getNetworkparams(network: string): Observable<any[]> {
    const path = `${this.networkparamsUrl}`;
    return this.http.get<any[]>(path, {headers: this.headers, params: {network: network}}).map(response => {
      if(!Array.isArray(response)) response = Object.values(Object.values(response)[0]);
      return response.map(x => {
        return x;
      });
    });
  }
  /** POST: add a new Team to the server */
  createShift (networkparam: NetworkParam): Observable<NetworkParam> {
    return this.http.post<NetworkParam>(this.networkparamsUrl, networkparam, {headers: this.headers});
  }
  /** PUT: update the Team on the server */
  updateShift (networkparam: NetworkParam): Observable<any> {
    return this.http.put<NetworkParam>(this.networkparamsUrl, networkparam, {headers: this.headers});
  }
}
