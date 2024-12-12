import { CanActivateFn, Router } from '@angular/router';
import { AdminAuthService } from './admin-auth.service';
import { inject } from '@angular/core';

export const adminOutGuard: CanActivateFn = (route, state) => {

  const adminService = inject(AdminAuthService); 
  const router = inject(Router); 

  if (adminService.isAdminleggedIn() === false) {
    return true;
  } else {
    router.navigate(['/admin/admin-dashboard']); 
    return false;
  }
};
