import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEqFormComponent } from './add-edit-eq-form.component';

describe('AddEditEqFormComponent', () => {
  let component: AddEditEqFormComponent;
  let fixture: ComponentFixture<AddEditEqFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditEqFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditEqFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
