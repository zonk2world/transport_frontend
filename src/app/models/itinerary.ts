import { Team } from "../classes/team";

export class Itinerary {
  month: number;
  day: Date;
  network: string;
  shift: string;
  team: Team;
  chunks: any[];
}
export enum ShiftStatus {
  ShiftDisabled = 0,
  ShiftEnabled = 1,
  ShiftModified = 2
}

export class ItineraryListItem {
  day: Date;
  itineraries: Itinerary[];
  shifts: any[];

  constructor(day: Date, itinerary?: Itinerary, isBlacklist?: boolean) {
    this.day = day;
    this.itineraries = [];
    this.shifts = [];
    if (itinerary) {
      if (isBlacklist)
        this.addItinerary(itinerary, isBlacklist);
      else
        this.addItinerary(itinerary);
    }
  }

  public addItinerary(itinerary: Itinerary, isBlacklist = false) {
    let item = new Itinerary();
    item = {...itinerary};
    this.itineraries.push(item);
    if (item.team && item.team.uid) {
      this.shifts[item.shift] = isBlacklist ? ShiftStatus.ShiftModified : ShiftStatus.ShiftEnabled;
    } else {
      this.shifts[item.shift] = ShiftStatus.ShiftDisabled;
    }
  }
}