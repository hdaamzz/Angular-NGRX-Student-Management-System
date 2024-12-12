import { Component, OnInit } from '@angular/core';
import { UserHomeComponent } from './user-home/user-home.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [UserHomeComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent {
 
}

