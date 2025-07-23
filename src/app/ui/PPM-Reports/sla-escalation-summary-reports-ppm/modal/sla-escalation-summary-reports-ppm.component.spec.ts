import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaEscalationSummaryReportsPpmComponent } from './sla-escalation-summary-reports-ppm.component';

describe('SlaEscalationSummaryReportsPpmComponent', () => {
  let component: SlaEscalationSummaryReportsPpmComponent;
  let fixture: ComponentFixture<SlaEscalationSummaryReportsPpmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SlaEscalationSummaryReportsPpmComponent]
    });
    fixture = TestBed.createComponent(SlaEscalationSummaryReportsPpmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
