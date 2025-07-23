import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOccupancyStatisticsComponent } from './view-occupancy-statistics.component';

describe('ViewOccupancyStatisticsComponent', () => {
  let component: ViewOccupancyStatisticsComponent;
  let fixture: ComponentFixture<ViewOccupancyStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewOccupancyStatisticsComponent]
    });
    fixture = TestBed.createComponent(ViewOccupancyStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
