import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubDepartmentComponent } from './add-sub-department.component';

describe('AddSubDepartmentComponent', () => {
  let component: AddSubDepartmentComponent;
  let fixture: ComponentFixture<AddSubDepartmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSubDepartmentComponent]
    });
    fixture = TestBed.createComponent(AddSubDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
