import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckBookingComponent } from './check-booking.component';

describe('CheckBookingComponent', () => {
  let component: CheckBookingComponent;
  let fixture: ComponentFixture<CheckBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckBookingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
