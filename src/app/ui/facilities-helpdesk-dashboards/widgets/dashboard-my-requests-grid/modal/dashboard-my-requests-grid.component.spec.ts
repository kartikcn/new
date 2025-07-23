import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMyRequestsGridComponent } from './dashboard-my-requests-grid.component';

describe('DashboardMyRequestsGridComponent', () => {
  let component: DashboardMyRequestsGridComponent;
  let fixture: ComponentFixture<DashboardMyRequestsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardMyRequestsGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMyRequestsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
