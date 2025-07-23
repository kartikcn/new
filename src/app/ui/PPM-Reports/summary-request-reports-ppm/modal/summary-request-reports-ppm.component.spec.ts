import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryRequestReportsPpmComponent } from './summary-request-reports-ppm.component';

describe('SummaryRequestReportsPpmComponent', () => {
  let component: SummaryRequestReportsPpmComponent;
  let fixture: ComponentFixture<SummaryRequestReportsPpmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SummaryRequestReportsPpmComponent]
    });
    fixture = TestBed.createComponent(SummaryRequestReportsPpmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
