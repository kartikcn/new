import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomAvailibilityReportTableComponent } from './room-availibility-report-table.component';

describe('RoomAvailibilityReportTableComponent', () => {
  let component: RoomAvailibilityReportTableComponent;
  let fixture: ComponentFixture<RoomAvailibilityReportTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoomAvailibilityReportTableComponent]
    });
    fixture = TestBed.createComponent(RoomAvailibilityReportTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
