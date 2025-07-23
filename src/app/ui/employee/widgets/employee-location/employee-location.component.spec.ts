import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLocationComponent } from './employee-location.component';

describe('EmployeeLocationComponent', () => {
  let component: EmployeeLocationComponent;
  let fixture: ComponentFixture<EmployeeLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
