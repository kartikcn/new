import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterBudgetTermItemReportComponent } from './center-budget-term-item-report.component';

describe('CenterBudgetTermItemReportComponent', () => {
  let component: CenterBudgetTermItemReportComponent;
  let fixture: ComponentFixture<CenterBudgetTermItemReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CenterBudgetTermItemReportComponent]
    });
    fixture = TestBed.createComponent(CenterBudgetTermItemReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
