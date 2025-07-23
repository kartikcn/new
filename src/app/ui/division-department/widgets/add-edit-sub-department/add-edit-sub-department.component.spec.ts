import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSubDepartmentComponent } from './add-edit-sub-department.component';

describe('AddEditSubDepartmentComponent', () => {
  let component: AddEditSubDepartmentComponent;
  let fixture: ComponentFixture<AddEditSubDepartmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditSubDepartmentComponent]
    });
    fixture = TestBed.createComponent(AddEditSubDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
