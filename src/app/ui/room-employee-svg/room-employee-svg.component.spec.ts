import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomEmployeeSvgComponent } from './room-employee-svg.component';

describe('RoomEmployeeSvgComponent', () => {
  let component: RoomEmployeeSvgComponent;
  let fixture: ComponentFixture<RoomEmployeeSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomEmployeeSvgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomEmployeeSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
