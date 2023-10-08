import { TestBed } from '@angular/core/testing';

import { SwalAlertService } from './swal-alert.service';

describe('SwalAlertService', () => {
  let service: SwalAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwalAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
