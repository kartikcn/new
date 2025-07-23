import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingReportsByMonthComponent } from './booking-reports-by-month.component';

describe('BookingReportsByMonthComponent', () => {
  let component: BookingReportsByMonthComponent;
  let fixture: ComponentFixture<BookingReportsByMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingReportsByMonthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingReportsByMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
