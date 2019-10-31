import { TestBed } from '@angular/core/testing';

import { VillageCheckReverseService } from './village-check-reverse.service';

describe('VillageCheckReverseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VillageCheckReverseService = TestBed.get(VillageCheckReverseService);
    expect(service).toBeTruthy();
  });
});
