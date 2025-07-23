import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceAllocationStatisticsComponent } from './space-allocation-statistics.component';

describe('SpaceAllocationStatisticsComponent', () => {
  let component: SpaceAllocationStatisticsComponent;
  let fixture: ComponentFixture<SpaceAllocationStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpaceAllocationStatisticsComponent]
    });
    fixture = TestBed.createComponent(SpaceAllocationStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
