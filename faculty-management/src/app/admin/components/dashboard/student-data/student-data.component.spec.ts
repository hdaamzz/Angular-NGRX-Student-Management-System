import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDataComponent } from './student-data.component';

describe('StudentDataComponent', () => {
  let component: StudentDataComponent;
  let fixture: ComponentFixture<StudentDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
