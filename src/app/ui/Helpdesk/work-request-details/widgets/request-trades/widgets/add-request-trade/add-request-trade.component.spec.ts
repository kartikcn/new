import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRequestTradeComponent } from './add-request-trade.component';

describe('AddRequestTradeComponent', () => {
  let component: AddRequestTradeComponent;
  let fixture: ComponentFixture<AddRequestTradeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddRequestTradeComponent]
    });
    fixture = TestBed.createComponent(AddRequestTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
