import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmPlannerReqDetailsTableComponent } from './pm-planner-req-details-table.component';

describe('PmPlannerReqDetailsTableComponent', () => {
  let component: PmPlannerReqDetailsTableComponent;
  let fixture: ComponentFixture<PmPlannerReqDetailsTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PmPlannerReqDetailsTableComponent]
    });
    fixture = TestBed.createComponent(PmPlannerReqDetailsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
