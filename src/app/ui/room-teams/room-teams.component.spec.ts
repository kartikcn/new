import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomTeamsComponent } from './room-teams.component';

describe('RoomTeamsComponent', () => {
  let component: RoomTeamsComponent;
  let fixture: ComponentFixture<RoomTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomTeamsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
