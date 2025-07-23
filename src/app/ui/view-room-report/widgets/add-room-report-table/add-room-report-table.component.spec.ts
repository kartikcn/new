import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRoomReportTableComponent } from './add-room-report-table.component';

describe('AddRoomReportTableComponent', () => {
  let component: AddRoomReportTableComponent;
  let fixture: ComponentFixture<AddRoomReportTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddRoomReportTableComponent]
    });
    fixture = TestBed.createComponent(AddRoomReportTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
