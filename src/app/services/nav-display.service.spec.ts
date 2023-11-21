import { TestBed } from '@angular/core/testing';

import { NavDisplayService } from '../services/nav-display.service';

describe('NavDisplayService', () => {
  let service: NavDisplayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavDisplayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
