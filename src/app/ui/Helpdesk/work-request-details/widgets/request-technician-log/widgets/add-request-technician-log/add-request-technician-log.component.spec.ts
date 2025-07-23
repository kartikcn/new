import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRequestTechnicianLogComponent } from './add-request-technician-log.component';

describe('AddRequestTechnicianLogComponent', () => {
  let component: AddRequestTechnicianLogComponent;
  let fixture: ComponentFixture<AddRequestTechnicianLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRequestTechnicianLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRequestTechnicianLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
