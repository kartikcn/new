import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditToolTypeComponent } from './add-edit-tool-type.component';

describe('AddEditToolTypeComponent', () => {
  let component: AddEditToolTypeComponent;
  let fixture: ComponentFixture<AddEditToolTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditToolTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditToolTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
