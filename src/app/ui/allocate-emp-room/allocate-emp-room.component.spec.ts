import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateEmpRoomComponent } from './allocate-emp-room.component';

describe('AllocateEmpRoomComponent', () => {
  let component: AllocateEmpRoomComponent;
  let fixture: ComponentFixture<AllocateEmpRoomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllocateEmpRoomComponent]
    });
    fixture = TestBed.createComponent(AllocateEmpRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
