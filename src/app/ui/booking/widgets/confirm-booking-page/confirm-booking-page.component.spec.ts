import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmBookingPageComponent } from './confirm-booking-page.component';

describe('ConfirmBookingPageComponent', () => {
  let component: ConfirmBookingPageComponent;
  let fixture: ComponentFixture<ConfirmBookingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmBookingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmBookingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
