import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable , PLATFORM_ID} from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

export interface admin{
  username:string;
  password:string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {

  adminUsername:string=environment.adminUsername;
  adminPassword:string=environment.adminPassword;

  constructor(private router:Router,
    @Inject(PLATFORM_ID) private platformId: Object ) { }

  //admin Login
  adminLogin(username:string,password:string){
    if(username == this.adminUsername && password == this.adminPassword){
      localStorage.setItem("token",(Math.random()+1 ).toString(36).substring(7));
      this.router.navigateByUrl('admin/admin-dashboard')
        console.log("Login Successfull");
        
    }else{
      console.log("Login is failed");
      this.router.navigateByUrl('admin/login')

    }

  }

  isAdminleggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem("token");
    }
    return false;
  }
}
