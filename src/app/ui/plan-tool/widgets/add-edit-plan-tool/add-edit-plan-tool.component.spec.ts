import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPlanToolComponent } from './add-edit-plan-tool.component';

describe('AddEditPlanToolComponent', () => {
  let component: AddEditPlanToolComponent;
  let fixture: ComponentFixture<AddEditPlanToolComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditPlanToolComponent]
    });
    fixture = TestBed.createComponent(AddEditPlanToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
