import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignEmployeeRoomComponent } from './assign-employee-room.component';

describe('AssignEmployeeRoomComponent', () => {
  let component: AssignEmployeeRoomComponent;
  let fixture: ComponentFixture<AssignEmployeeRoomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignEmployeeRoomComponent]
    });
    fixture = TestBed.createComponent(AssignEmployeeRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
