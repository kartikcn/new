import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditRequestOtherCostComponent } from './add-edit-request-other-cost.component';

describe('AddEditRequestOtherCostComponent', () => {
  let component: AddEditRequestOtherCostComponent;
  let fixture: ComponentFixture<AddEditRequestOtherCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditRequestOtherCostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditRequestOtherCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
