export class Stop {
  name: string;
  latitude: number;
  longitude: number;
  route: string;
  network: string;
  position: number;

  constructor(name: string = '', latitude: number = -1, longitude: number = -1, route: string = '', network: string = '', position: number = -1){
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
    this.route = route;
    this.network = network;
    this.position = position;
  }
}
