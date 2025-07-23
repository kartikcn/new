import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdddPlanTradeComponent } from './addd-plan-trade.component';

describe('AdddPlanTradeComponent', () => {
  let component: AdddPlanTradeComponent;
  let fixture: ComponentFixture<AdddPlanTradeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdddPlanTradeComponent]
    });
    fixture = TestBed.createComponent(AdddPlanTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
