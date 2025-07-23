import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTermsComponent } from './add-edit-terms.component';

describe('AddEditTermsComponent', () => {
  let component: AddEditTermsComponent;
  let fixture: ComponentFixture<AddEditTermsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditTermsComponent]
    });
    fixture = TestBed.createComponent(AddEditTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
