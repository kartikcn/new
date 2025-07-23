import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaEscalatedSummaryReportsComponent } from './sla-escalated-summary-reports.component';

describe('SlaEscalatedSummaryReportsComponent', () => {
  let component: SlaEscalatedSummaryReportsComponent;
  let fixture: ComponentFixture<SlaEscalatedSummaryReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlaEscalatedSummaryReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaEscalatedSummaryReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
