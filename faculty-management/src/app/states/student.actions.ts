import { createAction, props } from '@ngrx/store'
import { Student } from '../model/student';



export const loadStudentDetails = createAction('[Student] Load Details');

export const loadStudentDetailsSuccess = createAction(
  '[Student] Load Details Success',
  props<{ student: Student }>()
);
export const loadStudentDetailsFailure = createAction(
  '[Student] Load Details Failure',
  props<{ error: string }>()
);

export const updateStudentProfile = createAction(
  '[Student] Update Profile',
  props<{ studentData: any }>()
);
export const updateStudentProfileSuccess = createAction(
  '[Student] Update Profile Success',
  props<{ student: Student }>()
);
export const updateStudentProfileFailure = createAction(
  '[Student] Update Profile Failure',
  props<{ error: string }>()
);