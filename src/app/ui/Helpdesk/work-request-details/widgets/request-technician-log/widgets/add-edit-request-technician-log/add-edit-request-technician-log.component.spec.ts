import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditRequestTechnicianLogComponent } from './add-edit-request-technician-log.component';

describe('AddEditRequestTechnicianLogComponent', () => {
  let component: AddEditRequestTechnicianLogComponent;
  let fixture: ComponentFixture<AddEditRequestTechnicianLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditRequestTechnicianLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditRequestTechnicianLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
