import { Component, OnInit } from '@angular/core';
import { UserHomeComponent } from './user-home/user-home.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Student } from '../../../model/student';
import { selectStudent } from '../../../states/student.selectors';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [UserHomeComponent,CommonModule,AsyncPipe],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent {
    studentData$: Observable<Student | null>;
  
  constructor( private store: Store, ){ 
       this.studentData$ = this.store.select(selectStudent);
  }
}

