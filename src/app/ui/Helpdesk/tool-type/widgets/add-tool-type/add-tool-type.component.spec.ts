import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToolTypeComponent } from './add-tool-type.component';

describe('AddToolTypeComponent', () => {
  let component: AddToolTypeComponent;
  let fixture: ComponentFixture<AddToolTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddToolTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToolTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
