import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpmPlanComponent } from './ppm-plan.component';

describe('PpmPlanComponent', () => {
  let component: PpmPlanComponent;
  let fixture: ComponentFixture<PpmPlanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PpmPlanComponent]
    });
    fixture = TestBed.createComponent(PpmPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
