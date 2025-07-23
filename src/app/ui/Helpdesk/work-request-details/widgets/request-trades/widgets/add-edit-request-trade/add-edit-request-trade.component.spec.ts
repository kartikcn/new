import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditRequestTradeComponent } from './add-edit-request-trade.component';

describe('AddEditRequestTradeComponent', () => {
  let component: AddEditRequestTradeComponent;
  let fixture: ComponentFixture<AddEditRequestTradeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditRequestTradeComponent]
    });
    fixture = TestBed.createComponent(AddEditRequestTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
