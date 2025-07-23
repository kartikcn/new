import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTechnicianComponent } from './request-technician.component';

describe('RequestTechnicianComponent', () => {
  let component: RequestTechnicianComponent;
  let fixture: ComponentFixture<RequestTechnicianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestTechnicianComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestTechnicianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
