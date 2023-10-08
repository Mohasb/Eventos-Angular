import { TestBed } from '@angular/core/testing';

import { EventosServiceService } from './eventos-service.service';

describe('EventosServiceService', () => {
  let service: EventosServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventosServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
