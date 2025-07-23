import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRequestOtherCostComponent } from './add-request-other-cost.component';

describe('AddRequestOtherCostComponent', () => {
  let component: AddRequestOtherCostComponent;
  let fixture: ComponentFixture<AddRequestOtherCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRequestOtherCostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRequestOtherCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
