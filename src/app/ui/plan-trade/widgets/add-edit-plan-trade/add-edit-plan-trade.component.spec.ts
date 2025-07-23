import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPlanTradeComponent } from './add-edit-plan-trade.component';

describe('AddEditPlanTradeComponent', () => {
  let component: AddEditPlanTradeComponent;
  let fixture: ComponentFixture<AddEditPlanTradeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditPlanTradeComponent]
    });
    fixture = TestBed.createComponent(AddEditPlanTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
