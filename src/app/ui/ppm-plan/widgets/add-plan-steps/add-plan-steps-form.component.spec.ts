import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlanStepsFormComponent } from './add-plan-steps-form.component';

describe('AddPlanStepsFormComponent', () => {
  let component: AddPlanStepsFormComponent;
  let fixture: ComponentFixture<AddPlanStepsFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPlanStepsFormComponent]
    });
    fixture = TestBed.createComponent(AddPlanStepsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
