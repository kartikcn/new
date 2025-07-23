import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmstdComponent } from './emstd.component';

describe('EmstdComponent', () => {
  let component: EmstdComponent;
  let fixture: ComponentFixture<EmstdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmstdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmstdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
