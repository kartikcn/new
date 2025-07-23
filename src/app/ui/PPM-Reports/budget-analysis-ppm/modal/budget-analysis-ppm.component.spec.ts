import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetAnalysisPpmComponent } from './budget-analysis-ppm.component';

describe('BudgetAnalysisPpmComponent', () => {
  let component: BudgetAnalysisPpmComponent;
  let fixture: ComponentFixture<BudgetAnalysisPpmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BudgetAnalysisPpmComponent]
    });
    fixture = TestBed.createComponent(BudgetAnalysisPpmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
