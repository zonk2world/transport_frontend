import { Injectable, Inject } from '@angular/core';
import { Observable} from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import 'rxjs/add/operator/map';
import {AuthService} from "./auth.service";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class AccessRightsService {

  private accessRightsUrl = `${this.apiEndpoint}/accessRights`;
  public userAccessRights: string[];
  public ACCESS_RIGHTS: any[] = [
    {name: 'Access Rights', id: 'accessRights', viewName: 'view_access_rights', editName: 'edit_access_rights', group_id: 'hr'},
  ];

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    @Inject('API_ENDPOINT') private apiEndpoint: string
  ) {
  }


  getAccessRights(sites: string[], users: string[]): Observable<any[]> {
    return  this.http.post<any[]>(`${this.accessRightsUrl}/getBySites`, {sites: sites, users: users}, httpOptions);
  }

  setAccessRights(sites: any[], users: string[], rights: string[]): Observable<any[]> {
    return  this.http.post<any[]>(`${this.accessRightsUrl}/setBySites`, {sites: sites, users: users, rights: rights}, httpOptions);
  }

  getRightsBySiteIdAndUserId(site: string, user: string): Observable<any[]> {
    return  this.http.post<any[]>(`${this.accessRightsUrl}/getBySiteIdAndUserId`, {site: site, user: user}, httpOptions);
  }

  private getAccessRight(rightName: string, actionId: string): boolean {
    let actionName : string;
    let hasRight : boolean = false;
    this.ACCESS_RIGHTS.forEach(item => {
      if (item.id === rightName) {
        actionName = item[actionId];
      }
    });
    if (this.userAccessRights) {
      hasRight = this.userAccessRights.indexOf(actionName) > -1;
    }
    return hasRight;
  }

  canView(rightName: string): boolean {
    return this.getAccessRight(rightName, 'viewName');
  }

  canEdit(rightName: string): boolean {
    return this.getAccessRight(rightName, 'editName');
  }
}
