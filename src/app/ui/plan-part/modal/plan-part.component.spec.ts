import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanPartComponent } from './plan-part.component';

describe('PlanPartComponent', () => {
  let component: PlanPartComponent;
  let fixture: ComponentFixture<PlanPartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanPartComponent]
    });
    fixture = TestBed.createComponent(PlanPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
