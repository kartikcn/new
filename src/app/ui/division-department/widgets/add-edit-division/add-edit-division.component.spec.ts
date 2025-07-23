import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDivisionComponent } from './add-edit-division.component';

describe('AddEditDivisionComponent', () => {
  let component: AddEditDivisionComponent;
  let fixture: ComponentFixture<AddEditDivisionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditDivisionComponent]
    });
    fixture = TestBed.createComponent(AddEditDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
