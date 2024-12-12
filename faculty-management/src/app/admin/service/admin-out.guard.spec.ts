import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminOutGuard } from './admin-out.guard';

describe('adminOutGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminOutGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
