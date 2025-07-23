import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCenterBudgetComponent } from './add-edit-center-budget.component';

describe('AddEditCenterBudgetComponent', () => {
  let component: AddEditCenterBudgetComponent;
  let fixture: ComponentFixture<AddEditCenterBudgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditCenterBudgetComponent]
    });
    fixture = TestBed.createComponent(AddEditCenterBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
