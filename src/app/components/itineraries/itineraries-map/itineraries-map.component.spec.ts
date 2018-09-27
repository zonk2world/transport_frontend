import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItinerariesMapComponent } from './itineraries-map.component';

describe('ItinerariesMapComponent', () => {
  let component: ItinerariesMapComponent;
  let fixture: ComponentFixture<ItinerariesMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItinerariesMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItinerariesMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
