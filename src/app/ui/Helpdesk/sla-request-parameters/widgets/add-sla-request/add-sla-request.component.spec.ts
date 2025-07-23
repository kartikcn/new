import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSlaRequestComponent } from './add-sla-request.component';

describe('AddSlaRequestComponent', () => {
  let component: AddSlaRequestComponent;
  let fixture: ComponentFixture<AddSlaRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSlaRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSlaRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
