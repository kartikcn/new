import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPlanPartComponent } from './add-edit-plan-part.component';

describe('AddEditPlanPartComponent', () => {
  let component: AddEditPlanPartComponent;
  let fixture: ComponentFixture<AddEditPlanPartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditPlanPartComponent]
    });
    fixture = TestBed.createComponent(AddEditPlanPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
