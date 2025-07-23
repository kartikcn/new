import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSlaRequestStepsComponent } from './add-sla-request-steps.component';

describe('AddSlaRequestStepsComponent', () => {
  let component: AddSlaRequestStepsComponent;
  let fixture: ComponentFixture<AddSlaRequestStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSlaRequestStepsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSlaRequestStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
