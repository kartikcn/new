import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianTimeUsageAnalysisPpmComponent } from './technician-time-usage-analysis-ppm.component';

describe('TechnicianTimeUsageAnalysisPpmComponent', () => {
  let component: TechnicianTimeUsageAnalysisPpmComponent;
  let fixture: ComponentFixture<TechnicianTimeUsageAnalysisPpmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TechnicianTimeUsageAnalysisPpmComponent]
    });
    fixture = TestBed.createComponent(TechnicianTimeUsageAnalysisPpmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
