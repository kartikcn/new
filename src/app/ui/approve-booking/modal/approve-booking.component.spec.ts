import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveBookingComponent } from './approve-booking.component';

describe('ApproveBookingComponent', () => {
  let component: ApproveBookingComponent;
  let fixture: ComponentFixture<ApproveBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveBookingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
