import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscalationAlertsGridComponent } from './escalation-alerts-grid.component';

describe('EscalationAlertsGridComponent', () => {
  let component: EscalationAlertsGridComponent;
  let fixture: ComponentFixture<EscalationAlertsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EscalationAlertsGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EscalationAlertsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
