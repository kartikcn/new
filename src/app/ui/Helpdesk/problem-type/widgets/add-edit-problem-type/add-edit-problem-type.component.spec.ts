import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProblemTypeComponent } from './add-edit-problem-type.component';

describe('AddEditProblemTypeComponent', () => {
  let component: AddEditProblemTypeComponent;
  let fixture: ComponentFixture<AddEditProblemTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditProblemTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditProblemTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
