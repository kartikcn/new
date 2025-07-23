import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationReportByBlFlComponent } from './allocation-report-by-bl-fl.component';

describe('AllocationReportByBlFlComponent', () => {
  let component: AllocationReportByBlFlComponent;
  let fixture: ComponentFixture<AllocationReportByBlFlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllocationReportByBlFlComponent]
    });
    fixture = TestBed.createComponent(AllocationReportByBlFlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
