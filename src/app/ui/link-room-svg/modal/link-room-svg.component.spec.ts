import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkRoomSvgComponent } from './link-room-svg.component';

describe('LinkRoomSvgComponent', () => {
  let component: LinkRoomSvgComponent;
  let fixture: ComponentFixture<LinkRoomSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkRoomSvgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkRoomSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
