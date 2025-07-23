import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmstdListComponent } from './emstd-list.component';

describe('EmstdListComponent', () => {
  let component: EmstdListComponent;
  let fixture: ComponentFixture<EmstdListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmstdListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmstdListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
