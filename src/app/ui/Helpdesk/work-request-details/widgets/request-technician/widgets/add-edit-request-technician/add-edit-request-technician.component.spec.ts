import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditRequestTechnicianComponent } from './add-edit-request-technician.component';

describe('AddEditRequestTechnicianComponent', () => {
  let component: AddEditRequestTechnicianComponent;
  let fixture: ComponentFixture<AddEditRequestTechnicianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditRequestTechnicianComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditRequestTechnicianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
