import {Stop} from './stop';

export class Line {
  network: string;
  route_short_name: string;
  route_color: string;
  route_long_name: string;
  route_text_color: string;
  route_type: string;
  uid: string;
  stops: Stop[];

  constructor(network: string = '', route_short_name: string = '', route_color: string = '',
              route_long_name: string = '', route_text_color: string = '', route_type: string = '',
              uid: string = '', stops: Stop[] = [])
    {
      this.network = network;
      this.route_short_name = route_short_name;
      this.route_color = route_color;
      this.route_long_name = route_long_name;
      this.route_text_color = route_text_color;
      this.route_type = route_type;
      this.uid = uid;
      this.stops = stops;
  }
}
