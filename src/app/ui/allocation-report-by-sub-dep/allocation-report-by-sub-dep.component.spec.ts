import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationReportBySubDepComponent } from './allocation-report-by-sub-dep.component';

describe('AllocationReportBySubDepComponent', () => {
  let component: AllocationReportBySubDepComponent;
  let fixture: ComponentFixture<AllocationReportBySubDepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllocationReportBySubDepComponent]
    });
    fixture = TestBed.createComponent(AllocationReportBySubDepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
