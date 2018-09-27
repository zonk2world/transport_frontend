import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItinerariesDetailsComponent } from './itineraries-details.component';

describe('ItineraryDetailsComponent', () => {
  let component: ItinerariesDetailsComponent;
  let fixture: ComponentFixture<ItinerariesDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItinerariesDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItinerariesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
