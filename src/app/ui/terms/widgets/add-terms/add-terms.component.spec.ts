import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTermsComponent } from './add-terms.component';

describe('AddTermsComponent', () => {
  let component: AddTermsComponent;
  let fixture: ComponentFixture<AddTermsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTermsComponent]
    });
    fixture = TestBed.createComponent(AddTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
