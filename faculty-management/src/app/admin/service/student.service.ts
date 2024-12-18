import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Student } from '../../model/student';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private backUrl = 'http://localhost:3000/admin'

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }
  getStudentDetails(): Observable<Student | null> {

    if (!isPlatformBrowser(this.platformId)) {
      console.log('Not running in browser');
      return of(null);
    }


    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    if (!token) {
      console.warn('No authentication token found');
      return of(null);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<Student>(`${this.backUrl}/student-details`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching student details:', error);
        return of(null);
      })
    );
  }
  updateStudentProfile(studentData: FormData): Observable<Student | null> {
    if (!isPlatformBrowser(this.platformId)) {
      console.warn('Not running in browser');
      return of(null);
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    if (!token) {
      console.warn('No authentication token found');
      return of(null);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<Student>(`${this.backUrl}/user/${studentData.get('_id')}`, studentData, { headers }).pipe(
      catchError(error => {
        console.error('Error updating student profile:', error);
        return of(null);
      })
    );
  }
  getProfileImageUrl(filename: string): string {
    return `http://localhost:3000/admin/profile-image/${filename}`;
  }


}
