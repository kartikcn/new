import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProblemDescriptionFormComponent } from './add-edit-problem-description-form.component';

describe('AddEditProblemDescriptionFormComponent', () => {
  let component: AddEditProblemDescriptionFormComponent;
  let fixture: ComponentFixture<AddEditProblemDescriptionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditProblemDescriptionFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditProblemDescriptionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
