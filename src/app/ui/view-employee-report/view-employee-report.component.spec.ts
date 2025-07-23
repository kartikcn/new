import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmployeeReportComponent } from './view-employee-report.component';

describe('ViewEmployeeReportComponent', () => {
  let component: ViewEmployeeReportComponent;
  let fixture: ComponentFixture<ViewEmployeeReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewEmployeeReportComponent]
    });
    fixture = TestBed.createComponent(ViewEmployeeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
