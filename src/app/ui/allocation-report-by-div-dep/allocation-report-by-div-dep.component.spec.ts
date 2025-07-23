import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationReportByDivDepComponent } from './allocation-report-by-div-dep.component';

describe('AllocationReportByDivDepComponent', () => {
  let component: AllocationReportByDivDepComponent;
  let fixture: ComponentFixture<AllocationReportByDivDepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllocationReportByDivDepComponent]
    });
    fixture = TestBed.createComponent(AllocationReportByDivDepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
