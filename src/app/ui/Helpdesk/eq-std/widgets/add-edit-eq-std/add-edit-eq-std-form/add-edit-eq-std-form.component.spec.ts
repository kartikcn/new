import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEqStdFormComponent } from './add-edit-eq-std-form.component';

describe('AddEditEqStdFormComponent', () => {
  let component: AddEditEqStdFormComponent;
  let fixture: ComponentFixture<AddEditEqStdFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditEqStdFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditEqStdFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
