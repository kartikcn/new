import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCenterUsageComponent } from './add-edit-center-usage.component';

describe('AddEditCenterUsageComponent', () => {
  let component: AddEditCenterUsageComponent;
  let fixture: ComponentFixture<AddEditCenterUsageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditCenterUsageComponent]
    });
    fixture = TestBed.createComponent(AddEditCenterUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
