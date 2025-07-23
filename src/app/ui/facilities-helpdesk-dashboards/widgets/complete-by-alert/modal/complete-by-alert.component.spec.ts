import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteByAlertComponent } from './complete-by-alert.component';

describe('CompleteByAlertComponent', () => {
  let component: CompleteByAlertComponent;
  let fixture: ComponentFixture<CompleteByAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteByAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteByAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
