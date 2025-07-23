import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorplanArrangementSvgComponent } from './floorplan-arrangement-svg.component';

describe('FloorplanArrangementSvgComponent', () => {
  let component: FloorplanArrangementSvgComponent;
  let fixture: ComponentFixture<FloorplanArrangementSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloorplanArrangementSvgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorplanArrangementSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
