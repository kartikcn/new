import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestOtherCostComponent } from './request-other-cost.component';

describe('RequestOtherCostComponent', () => {
  let component: RequestOtherCostComponent;
  let fixture: ComponentFixture<RequestOtherCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestOtherCostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestOtherCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
