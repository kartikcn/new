import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterBudgetListComponent } from './center-budget-list.component';

describe('CenterBudgetListComponent', () => {
  let component: CenterBudgetListComponent;
  let fixture: ComponentFixture<CenterBudgetListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CenterBudgetListComponent]
    });
    fixture = TestBed.createComponent(CenterBudgetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
