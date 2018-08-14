import { Time } from "@angular/common";


export class Shift {
  start: Date;
  end: Date;
  name: string;
}

export class NetworkParam {
  network: string;
  valid_from: string;
  shifts: Shift[];
}