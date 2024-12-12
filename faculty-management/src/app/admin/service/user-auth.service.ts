import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private baseUrl = 'http://localhost:3000/admin';
  private loggedIn = new BehaviorSubject<boolean>(false);
  
  constructor(
    private http: HttpClient, 
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkLoginStatus();
      this.preventBack();
    }
  }

  login(user: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, user);
  }


  setLoggedIn(status: boolean) {
    if (isPlatformBrowser(this.platformId)) {
      this.loggedIn.next(status);
    }
  }

  
  isUserloggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem("authToken");
    }
    return false;
  }

 
  private checkLoginStatus() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      this.loggedIn.next(!!token);
    }
  }

 
  private preventBack() {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('popstate', () => {
        if (this.isUserloggedIn()) {
          this.router.navigate(['/user/user-dashboard']);
        }
      });
    }
  }

  // Logout method
  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      this.loggedIn.next(false);
      this.router.navigate(['/user/user-login']);
    }
  }
}