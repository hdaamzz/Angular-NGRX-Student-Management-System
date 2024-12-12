import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Student } from '../../../model/student';
import { AdminDataService } from '../../../admin/service/admin-data.service';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterLink],
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.css'
})
export class UserRegisterComponent implements OnInit {
  studentDetailsForm!: FormGroup;
  studentObj: Student = {
    _id: '',
    faculty_number: 0,
    faculty_name: '',
    joining_year: 0,
    birth_date: '',
    department: '',
    mobile: 0,
    email: '',
    password: '',
  };

  allFaculties: Student[] = [];

  constructor(private fb: FormBuilder, private dataService: AdminDataService, private router: Router) { }
  ngOnInit(): void {
    this.initializeForm();
    this.getAllFaculties()
  }
  private initializeForm() {
    this.studentDetailsForm = this.fb.group({
      faculty_name: ['', [Validators.required]],
      joining_year: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      birth_date: ['', [Validators.required]],
      department: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10,13}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  private getFacultyNumber(): number {
    if (this.allFaculties.length === 0) {
      return 1;
    }
    const maxFacultyNumber = Math.max(...this.allFaculties.map(faculty => faculty.faculty_number || 0));
    return maxFacultyNumber + 1;
  }

  addNewFaculty() {
    if (this.studentDetailsForm.invalid) {
      Object.keys(this.studentDetailsForm.controls).forEach(field => {
        const control = this.studentDetailsForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }

    const formValues = this.studentDetailsForm.value;
    const newFaculty: Student = {
      ...formValues,
      faculty_number: this.getFacultyNumber()
    };


    this.dataService.addFaculty(newFaculty).pipe(
      tap(() => this.studentDetailsForm.reset()),
      catchError(this.handleError('addFaculty'))
    ).subscribe({
      next: () => {
        
        
        this.router.navigate(['/user-login'], { queryParams: { registered: 'true' } });
      },
      error: () => {
        alert('Failed to add student. Please try again.');
      },
    });
  }
  // Error handling method
  private handleError<T>(operation = 'operation') {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return throwError(() => new Error(`${operation} failed`));
    };
  }

  getAllFaculties() {
    this.dataService.getAllFaculty().subscribe({
      next: (res) => {
        if (res.length === 0) {
          console.warn('No faculties found.');
          // Optional: Show a message to the user
          alert('No faculties found in the database.');
        } else {
          //console.log('Faculties fetched successfully:', res);
          this.allFaculties = res;
        }
      },
      error: (err) => {
        console.error('Error fetching faculties:', err);
        alert('Failed to fetch faculty details. Please try again later.');
      },
    });
  }

  resetForm() {
    this.studentDetailsForm.reset();
  }

}


