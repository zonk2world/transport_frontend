import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import {Observable} from 'rxjs';
import {User} from '../models/user';

@Injectable()
export class AuthService {
  authToken: any;
  isLoggedIn = false;
  user: User;
  constructor(
      protected httpClient: HttpClient,
      @Inject('API_ENDPOINT') private apiEndpoint: string
  ) {
    /*try {
      this.user = JSON.parse(localStorage.getItem('user'));
    } catch(e) {}*/
  }

  authenticateUser(user): Observable<any> {
    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post(`${this.apiEndpoint}/auth`, user, {headers: headers});
  }

  getProfile(): Observable<any> {
    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.loadToken();
    headers = headers.append('Authorization', this.authToken);
    return this.httpClient.get(`${this.apiEndpoint}/employee/profile`, {headers: headers});
  }

  storeUserData(token, user): void {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  getLoggedInUser(): User {
    return this.user;
  }
  setLoggedInUser(user: User) {
    this.user = user;
  }

  loadToken(): void {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn(): boolean {
    return tokenNotExpired('id_token');
  }

  logOut(): void {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
}
