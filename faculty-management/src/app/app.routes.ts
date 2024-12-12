import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './admin/components/login/login.component';
import { DashboardComponent } from './admin/components/dashboard/dashboard.component';
import { adminGuard } from './admin/service/admin.guard';
import { UserComponent } from './user/user.component';
import { UserLoginComponent } from './user/componenets/user-login/user-login.component';
import { UserDashboardComponent } from './user/componenets/user-dashboard/user-dashboard.component';
import { UserRegisterComponent } from './user/componenets/user-register/user-register.component';
import { userGuard } from './admin/service/user.guard';
import { adminOutGuard } from './admin/service/admin-out.guard';
export const routes: Routes = [
  // Admin Routes
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'login', component: LoginComponent,canActivate:[adminOutGuard] },
      { path: 'admin-dashboard', component: DashboardComponent, canActivate: [adminGuard] },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  
  // User Routes
  {
    path: 'user',
    component: UserComponent,
    children: [
      { path: 'user-login', component: UserLoginComponent },
      { path: 'user-dashboard', component: UserDashboardComponent ,canActivate: [userGuard]},
      { path:'user-registration', component: UserRegisterComponent },
      { path: '', redirectTo: 'user-login', pathMatch: 'full' }, 
    ],
  },
  
  // Default Route
  { path: '', redirectTo: 'user/user-login', pathMatch: 'full' }, 
  
  // Wildcard Route
  { path: '**', redirectTo: 'user/user-login', pathMatch: 'full' },
];
