import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmPlannerComponent } from './pm-planner.component';

describe('PmPlannerComponent', () => {
  let component: PmPlannerComponent;
  let fixture: ComponentFixture<PmPlannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PmPlannerComponent]
    });
    fixture = TestBed.createComponent(PmPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
