import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraryTimelineComponent } from './itinerary-timeline.component';

describe('ItineraryTimelineComponent', () => {
  let component: ItineraryTimelineComponent;
  let fixture: ComponentFixture<ItineraryTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItineraryTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItineraryTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
