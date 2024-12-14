import { createReducer, on } from '@ngrx/store';
import * as StudentActions from './student.actions';
import { Student } from '../model/student';


export interface StudentState {
    student: Student | null;
    loading: boolean;
    error: any;
}

export const initialState: StudentState = {
    student: null,
    loading: false,
    error: null
};

export const studentReducer = createReducer(
    initialState,
    
    on(StudentActions.loadStudentDetails, state => ({
      ...state, 
      loading: true,
      error: null
    })),
    on(StudentActions.loadStudentDetailsSuccess, (state, { student }) => {
      console.log('Reducer - Load Student Details Success:', student);
      return { ...state, student, loading: false, error: null };
    }),
    on(StudentActions.loadStudentDetailsFailure, (state, { error }) => ({
      ...state, 
      loading: false,
      error
    })),
    
    
    on(StudentActions.updateStudentProfile, state => ({
      ...state, 
      loading: true,
      error: null
    })),
    on(StudentActions.updateStudentProfileSuccess, (state, { student }) => {
      console.log('Reducer - Update Student Profile Success:', student);
      return { ...state, student, loading: false, error: null };
    }),
    on(StudentActions.updateStudentProfileFailure, (state, { error }) => ({
      ...state, 
      loading: false,
      error
    }))
  );