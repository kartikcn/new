import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightRoomsComponent } from './highlight-rooms.component';

describe('HighlightRoomsComponent', () => {
  let component: HighlightRoomsComponent;
  let fixture: ComponentFixture<HighlightRoomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighlightRoomsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HighlightRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
