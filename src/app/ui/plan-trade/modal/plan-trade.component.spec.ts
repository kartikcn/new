import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanTradeComponent } from './plan-trade.component';

describe('PlanTradeComponent', () => {
  let component: PlanTradeComponent;
  let fixture: ComponentFixture<PlanTradeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanTradeComponent]
    });
    fixture = TestBed.createComponent(PlanTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
