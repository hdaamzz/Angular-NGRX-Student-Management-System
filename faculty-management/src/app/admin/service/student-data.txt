import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../../model/student';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AdminDataService {
  private dataUrl = `${environment.apiBaseUrl}/admin/student`;  

  constructor(private http:HttpClient) { }



  addFaculty(studentObj:Student):Observable<Student>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Student>(this.dataUrl, studentObj, { headers });
  }

  getAllFaculty():Observable<Student[]>{
    return this.http.get<Student[]>(this.dataUrl)
  }

  updateFaculty(student:Student):Observable<Student>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Student>(this.dataUrl+'/'+student._id, student, { headers });

  }

  deleteFaculty(id:string):Observable<Student>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<Student>(this.dataUrl+'/'+id, { headers });

  }
}
