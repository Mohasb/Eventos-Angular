import { TestBed } from '@angular/core/testing';

import { ClientEditService } from './client-edit.service';

describe('ClientEditService', () => {
  let service: ClientEditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientEditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
