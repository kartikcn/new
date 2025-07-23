import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastDetailsComponent } from './forecast-details.component';

describe('ForecastDetailsComponent', () => {
  let component: ForecastDetailsComponent;
  let fixture: ComponentFixture<ForecastDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForecastDetailsComponent]
    });
    fixture = TestBed.createComponent(ForecastDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
