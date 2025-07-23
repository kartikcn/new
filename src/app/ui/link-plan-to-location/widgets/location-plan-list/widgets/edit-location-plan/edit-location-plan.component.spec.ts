import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLocationPlanComponent } from './edit-location-plan.component';

describe('EditLocationPlanComponent', () => {
  let component: EditLocationPlanComponent;
  let fixture: ComponentFixture<EditLocationPlanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditLocationPlanComponent]
    });
    fixture = TestBed.createComponent(EditLocationPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
