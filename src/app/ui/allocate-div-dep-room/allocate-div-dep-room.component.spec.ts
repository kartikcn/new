import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateDivDepRoomComponent } from './allocate-div-dep-room.component';

describe('AllocateDivDepRoomComponent', () => {
  let component: AllocateDivDepRoomComponent;
  let fixture: ComponentFixture<AllocateDivDepRoomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllocateDivDepRoomComponent]
    });
    fixture = TestBed.createComponent(AllocateDivDepRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
