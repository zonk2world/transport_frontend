import { Employee } from './employee';
export class Team {
    uid: string;
    name: string;
    network: string;
    day: any;
    employees: Employee[];
    shift: any;
    active: boolean;
    startdate: any;
    enddate: any;
    children: Team[];

    constructor(uid: string = '', name: string = '', network: string = '', day: any = '', startdate: string ='', enddate: string ='',
                employees: Employee[] = [], shift: any = {})
      {
        this.uid = uid;
        this.name= name;
        this.network = network;
        this.day = day;
        this.startdate = startdate;
        this.enddate = enddate;
        this.employees = employees;
        this.shift = shift;
        this.active = false;
        this.children = [];
    }
}

export enum TeamPeriod {
  CurrentlyActive = 0,
  Last30Days = 1,
  Last6Days = 2
}
