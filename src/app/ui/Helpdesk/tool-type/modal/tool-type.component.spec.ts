import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolTypeComponent } from './tool-type.component';

describe('ToolTypeComponent', () => {
  let component: ToolTypeComponent;
  let fixture: ComponentFixture<ToolTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
