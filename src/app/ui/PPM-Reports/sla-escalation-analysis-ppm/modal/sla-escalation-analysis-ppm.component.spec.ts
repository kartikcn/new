import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaEscalationAnalysisPpmComponent } from './sla-escalation-analysis-ppm.component';

describe('SlaEscalationAnalysisPpmComponent', () => {
  let component: SlaEscalationAnalysisPpmComponent;
  let fixture: ComponentFixture<SlaEscalationAnalysisPpmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SlaEscalationAnalysisPpmComponent]
    });
    fixture = TestBed.createComponent(SlaEscalationAnalysisPpmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
