import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSlaResponseComponent } from './add-sla-response.component';

describe('AddSlaResponseComponent', () => {
  let component: AddSlaResponseComponent;
  let fixture: ComponentFixture<AddSlaResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSlaResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSlaResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
