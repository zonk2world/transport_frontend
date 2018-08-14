export default class MapOptions {
  search_bar: boolean;
  polygon: {} | false;
  circle: {} | false;
  marker: {} | false;
  editing: boolean;
  centerLocation: {lat: number, lng: number};

  constructor(search_bar: boolean,
              polygon: {} | false,
              circle: {} | false,
              marker: {} | false,
              editing: boolean,
              centerLocation: { lat: number; lng: number }) {

    this.search_bar = search_bar;
    this.polygon = polygon;
    this.circle = circle;
    this.marker = marker;
    this.centerLocation = centerLocation;
    this.editing = editing;
  }
}
