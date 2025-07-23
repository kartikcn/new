import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceAllocationRoomListComponent } from './space-allocation-room-list.component';

describe('SpaceAllocationRoomListComponent', () => {
  let component: SpaceAllocationRoomListComponent;
  let fixture: ComponentFixture<SpaceAllocationRoomListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpaceAllocationRoomListComponent]
    });
    fixture = TestBed.createComponent(SpaceAllocationRoomListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
