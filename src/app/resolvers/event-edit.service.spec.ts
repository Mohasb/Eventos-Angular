import { TestBed } from '@angular/core/testing';

import { EventEditService } from './event-edit.service';

describe('EventEditService', () => {
  let service: EventEditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventEditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
