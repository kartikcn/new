import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWrProblemTypeComponent } from './add-wr-problem-type.component';

describe('AddProblemTypeComponent', () => {
  let component: AddWrProblemTypeComponent;
  let fixture: ComponentFixture<AddWrProblemTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddWrProblemTypeComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWrProblemTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
