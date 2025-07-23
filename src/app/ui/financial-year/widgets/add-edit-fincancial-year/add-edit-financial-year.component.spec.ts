import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditFinancialYearComponent } from './add-edit-financial-year.component';

describe('AddEditFinancialYearComponent', () => {
  let component: AddEditFinancialYearComponent;
  let fixture: ComponentFixture<AddEditFinancialYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditFinancialYearComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditFinancialYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
