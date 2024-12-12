import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Student } from '../../../../model/student';
import { StudentService } from '../../../../admin/service/student.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule ],
  providers:[provideAnimations()],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent implements OnInit{
  studentData: Student | null = null;
  editForm!: FormGroup;
  constructor(private router:Router, private studentService: StudentService, private fb: FormBuilder,private toastr:ToastrService){this.createForm();}

  ngOnInit(): void {
    this.StudentDetails();
  }

  StudentDetails(){
    this.studentService.getStudentDetails().subscribe({
      next:(student)=>{
        this.studentData=student;
        
        this.editForm.patchValue(student);
      },
      error:(error)=>{
        console.error('Error in geting student data',error);
        this.signout();
      }
    })
  }

  createForm(){
    this.editForm=this.fb.group({
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
    
      const formValue = {
        ...this.editForm.value,
        _id: this.studentData?._id
      };

     
      if (formValue.birth_date) {
        formValue.birth_date = this.formatDate(formValue.birth_date);
    }

      this.studentService.updateStudentProfile(formValue).subscribe({
        next: (updatedStudent) => {
          console.log("Student updated successfully", updatedStudent);
          this.studentData = updatedStudent;

          this.toastr.success("Profile updated successfully!","Updated")
          //alert('Profile updated successfully!');

        },
        error: (error) => {
          console.error('Error updating student profile', error);
          
          if (error.error && error.error.message) {
            //alert(error.error.message);
            this.toastr.error(error.error.message)
          } else {
           // alert('Failed to update profile. Please try again.');
           this.toastr.error("Failed to update profile. Please try again.","Error")
          }
        }
      });
    } else {
      
      this.collectFormValidationErrors();
    }
  }

  collectFormValidationErrors() {
    const errors: string[] = [];
    Object.keys(this.editForm.controls).forEach(key => {
      const controlErrors = this.editForm.get(key)?.errors;
      if (controlErrors) {
        switch(key) {
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

  signout(){
    localStorage.removeItem("authToken");
    this.toastr.info("Successfully LogOut.","Signout")
    this.router.navigateByUrl('user/user-login')
  }

  
}
