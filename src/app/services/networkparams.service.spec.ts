import { TestBed, inject } from '@angular/core/testing';

import { NetworkparamsService } from './networkparams.service';

describe('NetworkparamsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NetworkparamsService]
    });
  });

  it('should be created', inject([NetworkparamsService], (service: NetworkparamsService) => {
    expect(service).toBeTruthy();
  }));
});
