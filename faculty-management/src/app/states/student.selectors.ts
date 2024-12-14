import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StudentState } from './student.reducer';

export const selectStudentState = createFeatureSelector<StudentState>('student');
export const selectStudent = createSelector(
    selectStudentState,
    (state) => state?.student
);

export const selectStudentLoading = createSelector(
    selectStudentState,
    (state) => state?.loading
);

export const selectStudentError = createSelector(
    selectStudentState,
    (state) => state?.error
);