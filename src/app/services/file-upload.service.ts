import {Inject, Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import "rxjs-compat/add/operator/catch";
import "rxjs-compat/add/observable/throw";

@Injectable()
export class FileUploadService {
  private fileUploadUrl = `${this.apiEndpoint}/fileUpload`;
  private headers = new HttpHeaders({'Authorization': localStorage.getItem('id_token')});

  constructor(private http: HttpClient, @Inject('API_ENDPOINT') private apiEndpoint: string) {}

  createRoutes(fileArray: any): Observable<boolean> {
    // const formData: FormData = new FormData();
    // formData.append('fileKey', fileJson, name);
    // console.log(formData);

    return this.http
      .post(this.fileUploadUrl, fileArray, {headers: this.headers})
      .map(() => { return true; })
      .catch((error: any) => {
        return Observable.throwError(error.statusText);
      });
  }

  createStopTimes(fileArray: any): Observable<boolean> {
    // const formData: FormData = new FormData();
    // formData.append('fileKey', fileJson, name);
    // console.log(formData);

    const url = `${this.fileUploadUrl}/stopTimes`;

    return this.http
      .post(url, fileArray, {headers: this.headers})
      .map(() => { return true; })
      .catch((error: any) => {
        return Observable.throwError(error.statusText);
      });
  }

  getStopIndices(network, route_short_name, dest): Observable<boolean> {
    const url = `${this.fileUploadUrl}`;

    return this.http.get<any>(`${url}`, {
      headers: this.headers,
      params: {network: network, route_short_name: route_short_name, dest: dest}
    }).map(response => {
      // if(!Array.isArray(response)) response = Object.values(Object.values(response)[0]);
      return response.map(x => {
        return x;
      });
    });
  }

  getTimesByTripId(network, route_short_name, id, dir): Observable<boolean> {
    const url = `${this.fileUploadUrl}`;

    return this.http.get<any>(`${url}/getTimesByTripId`, {
      headers: this.headers,
      params: {network: network, route_short_name: route_short_name, trip_id: id, direction_id: dir}
    }).map(response => {
      // if(!Array.isArray(response)) response = Object.values(Object.values(response)[0]);
      return response.map(x => {
        return x;
      });
    });
  }

}
