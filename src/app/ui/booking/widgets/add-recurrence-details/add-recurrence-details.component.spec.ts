import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecurrenceDetailsComponent } from './add-recurrence-details.component';

describe('AddRecurrenceDetailsComponent', () => {
  let component: AddRecurrenceDetailsComponent;
  let fixture: ComponentFixture<AddRecurrenceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRecurrenceDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRecurrenceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
