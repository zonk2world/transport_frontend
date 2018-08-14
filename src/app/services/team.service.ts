import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Team } from '../classes/team';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable()
export class TeamService {

  private teamUrl = `${this.apiEndpoint}/teams`;
  private headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('id_token')});
  private params = ['uid', 'network', 'day', 'employees', 'shift'];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject('API_ENDPOINT') private apiEndpoint: string
  ) {
   }

  /** GET Teams from the server */
  getTeams(network: string = '', day?:string, period?: string): Observable<Team[]> {
    if (day === undefined) {
      day = new Date().toISOString();
    }

    return this.http.get<Team[]>(`${this.teamUrl}`, {headers: this.headers, params: {network: network, period:period, day: day}}).map(response => {
      if(!Array.isArray(response)) response = Object.values(Object.values(response)[0]);
      return response;
    });
  }

  getTeamsByAnyParam(params): Observable<Team[]> {
    for(let param of params) if(!this.params.includes(param)) return null;
    return this.http.get<Team[]>(`${this.teamUrl}`, {headers: this.headers, params: params}).map(response => {
      if(!Array.isArray(response)) response = Object.values(Object.values(response)[0]);
      return response.map(x => {
          return new Team(x.uid, x.name, x.network, x.day, x.startdate, x.enddate, x.employees, x.shift);
        });
    });
  }

  /** POST: add a new Team to the server */
  addTeam (team: Team): Observable<Team> {
    return this.http.post<Team>(this.teamUrl, team, {headers: this.headers});
  }

  /** PUT: update the Team on the server */
  updateTeam (team: Team): Observable<any> {
    return this.http.put<Team>(this.teamUrl, team, {headers: this.headers});
  }

  /** DELETE: delete the Team from the server */
  deleteTeam (team: Team): Observable<Team> {
    const uid = typeof team === 'string' ? team : team.uid;
    const url = `${this.teamUrl}?uid=${uid}`;

    return this.http.delete<Team>(url, {headers: this.headers});
  }
}
