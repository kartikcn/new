import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditWrProblemTypeComponent } from './add-edit-wr-problem-type.component';

describe('AddEditProblemTypeComponent', () => {
  let component: AddEditWrProblemTypeComponent;
  let fixture: ComponentFixture<AddEditWrProblemTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditWrProblemTypeComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditWrProblemTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
