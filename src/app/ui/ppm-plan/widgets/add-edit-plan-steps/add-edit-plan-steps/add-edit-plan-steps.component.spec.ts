import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPlanStepsComponent } from './add-edit-plan-steps.component';

describe('AddEditPlanStepsComponent', () => {
  let component: AddEditPlanStepsComponent;
  let fixture: ComponentFixture<AddEditPlanStepsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditPlanStepsComponent]
    });
    fixture = TestBed.createComponent(AddEditPlanStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
