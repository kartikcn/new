import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeDetailsComponent } from './trade-details.component';

describe('TradeDetailsComponent', () => {
  let component: TradeDetailsComponent;
  let fixture: ComponentFixture<TradeDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TradeDetailsComponent]
    });
    fixture = TestBed.createComponent(TradeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
