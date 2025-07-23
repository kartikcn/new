import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetTermsListComponent } from './budget-terms-list.component';

describe('BudgetTermsListComponent', () => {
  let component: BudgetTermsListComponent;
  let fixture: ComponentFixture<BudgetTermsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BudgetTermsListComponent]
    });
    fixture = TestBed.createComponent(BudgetTermsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
