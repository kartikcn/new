import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionDepartmentComponent } from './division-department.component';

describe('DivisionDepartmentComponent', () => {
  let component: DivisionDepartmentComponent;
  let fixture: ComponentFixture<DivisionDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DivisionDepartmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
