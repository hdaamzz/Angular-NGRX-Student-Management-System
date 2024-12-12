import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserAuthService } from './user-auth.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export const userGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserAuthService);
  const platformId = inject(PLATFORM_ID);

 
  if (isPlatformBrowser(platformId)) {
    if (userService.isUserloggedIn()) {
      return true;
    } else {
     
      router.navigate(['/user/user-login'], { 
        queryParams: { 
          returnUrl: state.url 
        } 
      });
      return false;
    }
  }

  return true;
};