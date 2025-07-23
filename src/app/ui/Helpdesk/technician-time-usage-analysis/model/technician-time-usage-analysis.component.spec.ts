import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianTimeUsageAnalysisComponent } from './technician-time-usage-analysis.component';

describe('TechnicianTimeUsageAnalysisComponent', () => {
  let component: TechnicianTimeUsageAnalysisComponent;
  let fixture: ComponentFixture<TechnicianTimeUsageAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicianTimeUsageAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicianTimeUsageAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
