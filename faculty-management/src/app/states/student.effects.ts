import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import * as StudentActions from './student.actions';
import { StudentService } from "../admin/service/student.service";
import { Student } from "../model/student";
import { log } from "node:console";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";


@Injectable({ 
  providedIn: 'root' 
})
export class StudentEffects {
  private userService: StudentService = inject(StudentService);
  private actions$: Actions = inject(Actions);
  private router: Router = inject(Router);
  private toastr: ToastrService = inject(ToastrService);

  loadStudentDetails$: Observable<any> = createEffect(() =>
    this.actions$.pipe(
      ofType(StudentActions.loadStudentDetails),
      switchMap(() =>
        this.userService.getStudentDetails().pipe(
          map(student => {
            if (student) {
              console.log('Loaded student details:', student);
              return StudentActions.loadStudentDetailsSuccess({ student });
            } 
            else {
              console.log('No student data found');
              return StudentActions.loadStudentDetailsFailure({ 
                error:"" 
              });
            }
          }
        ),
          catchError(error => {
            console.error('Error loading student details:', error);
            return of(StudentActions.loadStudentDetailsFailure({
              error: error.message || 'Failed to load student details'
            }));
          })
        )
      )
    )
  );
  updateStudentProfile$ = createEffect(() =>
    this.actions$.pipe(
        ofType(StudentActions.updateStudentProfile),
        switchMap(action => 
            this.userService.updateStudentProfile(action.studentData).pipe(
                map(student => {
                    if (student) {
                        this.toastr.success('Profile Updated Successfully', 'Success');
                        return StudentActions.updateStudentProfileSuccess({ student });
                    } else {
                        this.toastr.error('Failed to update profile', 'Error');
                        return StudentActions.updateStudentProfileFailure({
                            error: 'Failed to update student profile'
                        });
                    }
                }),
                catchError(error => of(StudentActions.updateStudentProfileFailure({
                    error: error?.message || 'Failed to update student profile'
                })))
            )
        )
    )
);
}