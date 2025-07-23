import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocateRoomComponent } from './locate-room.component';

describe('LocateRoomComponent', () => {
  let component: LocateRoomComponent;
  let fixture: ComponentFixture<LocateRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocateRoomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocateRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
