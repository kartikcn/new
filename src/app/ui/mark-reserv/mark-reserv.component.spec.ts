import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkReservComponent } from './mark-reserv.component';

describe('MarkReservComponent', () => {
  let component: MarkReservComponent;
  let fixture: ComponentFixture<MarkReservComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkReservComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkReservComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
