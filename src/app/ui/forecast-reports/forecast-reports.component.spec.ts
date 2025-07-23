import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastReportsComponent } from './forecast-reports.component';

describe('ForecastReportsComponent', () => {
  let component: ForecastReportsComponent;
  let fixture: ComponentFixture<ForecastReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForecastReportsComponent]
    });
    fixture = TestBed.createComponent(ForecastReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
