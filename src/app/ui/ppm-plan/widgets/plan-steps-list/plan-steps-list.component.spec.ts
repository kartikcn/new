import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanStepsListComponent } from './plan-steps-list.component';

describe('PlanStepsListComponent', () => {
  let component: PlanStepsListComponent;
  let fixture: ComponentFixture<PlanStepsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanStepsListComponent]
    });
    fixture = TestBed.createComponent(PlanStepsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
