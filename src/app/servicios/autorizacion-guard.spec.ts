import { TestBed } from '@angular/core/testing';
import { AutorizacionGuard } from './autorizacion-guard';

describe('AutorizacionGuard', () => {
  let service: AutorizacionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutorizacionGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
