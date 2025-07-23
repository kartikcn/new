import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditConnectorFldsComponent } from './add-edit-connector-flds.component';

describe('AddEditConnectorFldsComponent', () => {
  let component: AddEditConnectorFldsComponent;
  let fixture: ComponentFixture<AddEditConnectorFldsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditConnectorFldsComponent]
    });
    fixture = TestBed.createComponent(AddEditConnectorFldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
