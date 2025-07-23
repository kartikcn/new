import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationPlanListComponent } from './location-plan-list.component';

describe('LocationPlanListComponent', () => {
  let component: LocationPlanListComponent;
  let fixture: ComponentFixture<LocationPlanListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocationPlanListComponent]
    });
    fixture = TestBed.createComponent(LocationPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
