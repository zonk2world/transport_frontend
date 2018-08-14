import { TestBed, inject } from '@angular/core/testing';

import { ItinerariesService } from './itineraries.service';

describe('ItinerariesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItinerariesService]
    });
  });

  it('should be created', inject([ItinerariesService], (service: ItinerariesService) => {
    expect(service).toBeTruthy();
  }));
});
