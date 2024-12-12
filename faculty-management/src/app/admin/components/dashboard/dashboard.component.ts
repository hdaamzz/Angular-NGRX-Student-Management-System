import { Component, OnInit } from '@angular/core';
import { StudentDataComponent } from './student-data/student-data.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StudentDataComponent,CommonModule],
  
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  faculty:boolean=false;
  constructor(private router:Router){}
  ngOnInit(): void {
    this.showFacultyData()
  }

  setoff(){
    this.faculty=false;
  }

  showFacultyData(){
    this.setoff()
    this.faculty=true
  }
  signout(){
    localStorage.removeItem("token");

    this.router.navigateByUrl('admin/login')
  }

}
