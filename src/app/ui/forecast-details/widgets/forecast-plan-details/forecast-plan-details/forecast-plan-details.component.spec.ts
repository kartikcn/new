import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastPlanDetailsComponent } from './forecast-plan-details.component';

describe('ForecastPlanDetailsComponent', () => {
  let component: ForecastPlanDetailsComponent;
  let fixture: ComponentFixture<ForecastPlanDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForecastPlanDetailsComponent]
    });
    fixture = TestBed.createComponent(ForecastPlanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
