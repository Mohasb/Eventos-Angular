import { TestBed } from '@angular/core/testing';

import { EventDetailResolve } from './event-detail.resolve';

describe('EventDetailService', () => {
  let service: EventDetailResolve;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventDetailResolve);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
