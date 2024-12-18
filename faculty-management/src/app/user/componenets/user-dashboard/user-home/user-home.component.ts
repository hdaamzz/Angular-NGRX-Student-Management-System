import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Student } from '../../../../model/student';
import { StudentService } from '../../../../admin/service/student.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import * as StudentActions from "../../../../states/student.actions";
import { selectStudent, selectStudentLoading, selectStudentError } from '../../../../states/student.selectors';
import { Observable, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';


@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AsyncPipe],
  providers: [provideAnimations()],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent implements OnInit {

  editForm!: FormGroup;
  selectedFile: File | null = null;
  previewImage: string | ArrayBuffer | null = null;
  studentData$: Observable<Student | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  profileImageUrl: string | null = null;

  private subscriptions: Subscription[] = [];
  constructor(
    private store: Store,
    private router: Router,
    private studentService: StudentService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.createForm();


    this.studentData$ = this.store.select(selectStudent);
    this.loading$ = this.store.select(selectStudentLoading);
    this.error$ = this.store.select(selectStudentError);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = e.target?.result || null;
      };
      reader.readAsDataURL(file);
    }
  }

  ngOnInit(): void {
    this.StudentDetails();

    this.subscriptions.push(
      this.studentData$.pipe(
        filter(student => !!student)
      ).subscribe({
        next: (student) => {
          if (student) {
            console.log('Student data loaded:', student);
            this.editForm.patchValue(student);
          }
        },
        error: (err) => {
          console.error('Error loading student data', err);
          this.toastr.error('Failed to load student data', 'Error');
        }
      }),

      this.loading$.subscribe({
        next: (loading) => {
          if (!loading) {
          }
        },
        error: (err) => {
          console.error('Loading error', err);
        }
      }),

      this.error$.pipe(
        filter(error => !!error)
      ).subscribe({
        next: (error) => {
          console.error('Student data error:', error);

        }
      })
    );

    this.subscriptions.push(
      this.studentData$.pipe(
        filter(student => !!student)
      ).subscribe({
        next: (student) => {
          if (student) {
            console.log(' Student data loaded:', student);
            this.editForm.patchValue(student);
            this.profileImageUrl = student.profileImage ? this.studentService.getProfileImageUrl(student.profileImage) : null; // Set profile image URL
          }
        },
        error: (err) => {
          console.error('Error loading student data', err);
          this.toastr.error('Failed to load student data', 'Error');
        }
      })
    );
  }

  StudentDetails() {
    this.store.dispatch(StudentActions.loadStudentDetails());
  }

  createForm() {
    this.editForm = this.fb.group({
      _id: [''],
      faculty_name: ['', [Validators.required]],
      joining_year: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      birth_date: ['', [Validators.required]],
      department: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10,13}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onUpdateStudent() {
    this.editForm.markAllAsTouched();

    if (this.editForm.valid) {
      const formValue = { ...this.editForm.value };

     
      const formData = new FormData();

      
      Object.keys(formValue).forEach(key => {
        formData.append(key, formValue[key]);
      });

      
      if (this.selectedFile) {
        formData.append('profileImage', this.selectedFile, this.selectedFile.name);
      }

      if (!formValue._id) {
        const currentStudent = this.studentData$.pipe(take(1));
        currentStudent.subscribe(student => {
          if (student && student._id) {
            formData.set('_id', student._id);
            this.updateProfile(formData);
          } else {
            this.toastr.error('Unable to update profile: Missing ID', 'Error');
          }
        });
      } else {
        this.updateProfile(formData);
      }
    } else {
      this.collectFormValidationErrors();
    }
  }

  private updateProfile(formData: FormData) {
    this.store.dispatch(StudentActions.updateStudentProfile({ studentData: formData }));
  }


  collectFormValidationErrors() {
    const errors: string[] = [];
    Object.keys(this.editForm.controls).forEach(key => {
      const controlErrors = this.editForm.get(key)?.errors;
      if (controlErrors) {
        switch (key) {
          case 'faculty_name':
            if (controlErrors['required']) errors.push('Full Name is required');
            break;
          case 'email':
            if (controlErrors['required']) errors.push('Email is required');
            if (controlErrors['email']) errors.push('Invalid email format');
            break;
          case 'joining_year':
            if (controlErrors['required']) errors.push('Joining Year is required');
            break;
          case 'department':
            if (controlErrors['required']) errors.push('Department is required');
            break;
          case 'birth_date':
            if (controlErrors['required']) errors.push('Birth Date is required');
            break;
          case 'mobile':
            if (controlErrors['required']) errors.push('Mobile Number is required');
            if (controlErrors['pattern']) errors.push('Invalid Mobile Number');
            break;
          case 'password':
            if (controlErrors['required']) errors.push('Password is required');
            if (controlErrors['minlength']) errors.push('Password must be at least 8 characters');
            break;
        }
      }
    });


    if (errors.length > 0) {
      alert(errors.join('\n'));
    }
  }



  formatDate(date: string | Date): string {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  signout() {
    localStorage.removeItem("authToken");
    this.toastr.info("Successfully LogOut.", "Signout")
    this.router.navigateByUrl('user/user-login')
  }


}
