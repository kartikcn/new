import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkHotelComponent } from './mark-hotel.component';

describe('MarkHotelComponent', () => {
  let component: MarkHotelComponent;
  let fixture: ComponentFixture<MarkHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkHotelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
