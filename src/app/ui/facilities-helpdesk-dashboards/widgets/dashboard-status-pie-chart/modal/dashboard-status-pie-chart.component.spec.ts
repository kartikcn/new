import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardStatusPieChartComponent } from './dashboard-status-pie-chart.component';

describe('DashboardStatusPieChartComponent', () => {
  let component: DashboardStatusPieChartComponent;
  let fixture: ComponentFixture<DashboardStatusPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardStatusPieChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardStatusPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
