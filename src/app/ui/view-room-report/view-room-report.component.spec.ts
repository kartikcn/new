import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRoomReportComponent } from './view-room-report.component';

describe('ViewRoomReportComponent', () => {
  let component: ViewRoomReportComponent;
  let fixture: ComponentFixture<ViewRoomReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewRoomReportComponent]
    });
    fixture = TestBed.createComponent(ViewRoomReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
