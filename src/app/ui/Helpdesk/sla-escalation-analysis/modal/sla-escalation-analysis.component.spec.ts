import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaEscalationAnalysisComponent } from './sla-escalation-analysis.component';

describe('SlaEscalationAnalysisComponent', () => {
  let component: SlaEscalationAnalysisComponent;
  let fixture: ComponentFixture<SlaEscalationAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlaEscalationAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaEscalationAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
