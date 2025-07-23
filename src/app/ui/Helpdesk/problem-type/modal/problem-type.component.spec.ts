import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemTypeComponent } from './problem-type.component';

describe('ProblemTypeComponent', () => {
  let component: ProblemTypeComponent;
  let fixture: ComponentFixture<ProblemTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProblemTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
