import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRoomStatisticsReportTableComponent } from './add-room-statistics-report-table.component';

describe('AddRoomStatisticsReportTableComponent', () => {
  let component: AddRoomStatisticsReportTableComponent;
  let fixture: ComponentFixture<AddRoomStatisticsReportTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddRoomStatisticsReportTableComponent]
    });
    fixture = TestBed.createComponent(AddRoomStatisticsReportTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
