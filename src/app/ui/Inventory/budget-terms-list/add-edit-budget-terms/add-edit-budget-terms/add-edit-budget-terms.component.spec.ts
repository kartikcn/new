import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditBudgetTermsComponent } from './add-edit-budget-terms.component';

describe('AddEditBudgetTermsComponent', () => {
  let component: AddEditBudgetTermsComponent;
  let fixture: ComponentFixture<AddEditBudgetTermsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditBudgetTermsComponent]
    });
    fixture = TestBed.createComponent(AddEditBudgetTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
