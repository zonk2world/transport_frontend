import { Injectable, Inject } from '@angular/core';
import { Observable} from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders} from '@angular/common/http';


const httpOptions = {
  headers: new HttpHeaders()
};
@Injectable()
export class UploadService {

  private uploadUrl = `${this.apiEndpoint}/upload`;

  constructor(
    private http: HttpClient,
    @Inject('API_ENDPOINT') private apiEndpoint: string
  ) { }

  uploadBlobImage(blobImage: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('upload', blobImage, 'picture.png');
    console.log("formData :", formData);

    return this.http.post(this.uploadUrl, formData, httpOptions)
        .map(response => response);
  }

  uploadMulti(files: Array<File>): Observable<string[]> {

    const formData: any = new FormData();
    files = files || [];

    files.forEach(file => {
      formData.append('uploads', file, file['name']);
    });
    return this.http.post<string[]>(`${this.uploadUrl}/multi`, formData);
  }

  uploadSingle(files: Array<File>): Observable<string> {
    const formData: any = new FormData();
    const file = files[0] || [];

    formData.append('upload', file, file['name']);
    return this.http.post<string>(`${this.uploadUrl}/single`, formData);
  }

  dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);

    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const bb = new Blob([ab]);
    return bb;
  }

}
