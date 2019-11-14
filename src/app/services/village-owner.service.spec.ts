import { TestBed } from '@angular/core/testing';

import { VillageOwnerService } from './village-owner.service';

describe('VillageOwnerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VillageOwnerService = TestBed.get(VillageOwnerService);
    expect(service).toBeTruthy();
  });
});
