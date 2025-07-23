import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProblemDescriptionComponent } from './add-problem-description.component';

describe('AddProblemDescriptionComponent', () => {
  let component: AddProblemDescriptionComponent;
  let fixture: ComponentFixture<AddProblemDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProblemDescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProblemDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
