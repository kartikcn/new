import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTechnicianLogComponent } from './request-technician-log.component';

describe('RequestTechnicianLogComponent', () => {
  let component: RequestTechnicianLogComponent;
  let fixture: ComponentFixture<RequestTechnicianLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestTechnicianLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestTechnicianLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
