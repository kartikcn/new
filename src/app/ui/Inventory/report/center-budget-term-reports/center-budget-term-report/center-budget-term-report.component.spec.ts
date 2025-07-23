import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterBudgetTermReportComponent } from './center-budget-term-report.component';

describe('CenterBudgetTermReportComponent', () => {
  let component: CenterBudgetTermReportComponent;
  let fixture: ComponentFixture<CenterBudgetTermReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CenterBudgetTermReportComponent]
    });
    fixture = TestBed.createComponent(CenterBudgetTermReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
