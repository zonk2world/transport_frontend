import { Injectable, Inject } from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class SocketService {
  private socket;
  constructor(@Inject('API_ENDPOINT') private apiEndpoint: string) {
    this.socket = io(this.apiEndpoint);
  }

  public sendMessage(typeMessage: string, message: any) {
    this.socket.emit(typeMessage, message);
  }
}
