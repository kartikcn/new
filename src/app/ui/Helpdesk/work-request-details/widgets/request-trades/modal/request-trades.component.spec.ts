import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTradesComponent } from './request-trades.component';

describe('RequestTradesComponent', () => {
  let component: RequestTradesComponent;
  let fixture: ComponentFixture<RequestTradesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestTradesComponent]
    });
    fixture = TestBed.createComponent(RequestTradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
