import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnassignRoomsComponent } from './unassign-rooms.component';

describe('UnassignRoomsComponent', () => {
  let component: UnassignRoomsComponent;
  let fixture: ComponentFixture<UnassignRoomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnassignRoomsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnassignRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
