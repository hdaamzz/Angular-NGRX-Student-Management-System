import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Student } from '../../model/student';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private backUrl='http://localhost:3000/admin'

  constructor(private http:HttpClient,@Inject(PLATFORM_ID) private platformId: Object) { }

  getStudentDetails():Observable<Student>{
    if (!isPlatformBrowser(this.platformId)) {
      
      return of(null as any);
    }
    const token = localStorage.getItem('authToken');
    
    const headers=new HttpHeaders({
      'Authorization':`Bearer ${token}`
    })
    return this.http.get<Student>(`${this.backUrl}/student-details`, { headers })
  }

  updateStudentProfile(studentData: any): Observable<Student> {
    console.log("service hit", studentData);
    
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' // Change to JSON
    });
  
    // Use HTTP body directly instead of FormData
    return this.http.put<Student>(`${this.backUrl}/user/${studentData._id}`, studentData, { 
      headers 
    });
  }


}
