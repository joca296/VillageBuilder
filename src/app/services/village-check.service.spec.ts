import { TestBed } from '@angular/core/testing';

import { VillageCheckService } from './village-check.service';

describe('VillageCheckService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VillageCheckService = TestBed.get(VillageCheckService);
    expect(service).toBeTruthy();
  });
});
