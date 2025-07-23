import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceDashboardComponent } from './space-dashboard.component';

describe('SpaceDashboardComponent', () => {
  let component: SpaceDashboardComponent;
  let fixture: ComponentFixture<SpaceDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpaceDashboardComponent]
    });
    fixture = TestBed.createComponent(SpaceDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
