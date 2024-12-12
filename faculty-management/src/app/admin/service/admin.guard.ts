import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminAuthService } from './admin-auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const adminService = inject(AdminAuthService); 
  const router = inject(Router);

  if (adminService.isAdminleggedIn() === true) {
    return true;
  } else {
    router.navigate(['/admin/login']);
    return false;
  }
};