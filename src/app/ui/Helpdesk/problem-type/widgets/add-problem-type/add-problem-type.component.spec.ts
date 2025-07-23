import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProblemTypeComponent } from './add-problem-type.component';

describe('AddProblemTypeComponent', () => {
  let component: AddProblemTypeComponent;
  let fixture: ComponentFixture<AddProblemTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProblemTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProblemTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
