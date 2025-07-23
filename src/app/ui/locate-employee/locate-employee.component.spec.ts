import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocateEmployeeComponent } from './locate-employee.component';

describe('LocateEmployeeComponent', () => {
  let component: LocateEmployeeComponent;
  let fixture: ComponentFixture<LocateEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocateEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocateEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
