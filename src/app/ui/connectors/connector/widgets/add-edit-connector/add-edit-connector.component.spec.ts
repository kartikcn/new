import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditConnectorComponent } from './add-edit-connector.component';

describe('AddEditConnectorComponent', () => {
  let component: AddEditConnectorComponent;
  let fixture: ComponentFixture<AddEditConnectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditConnectorComponent]
    });
    fixture = TestBed.createComponent(AddEditConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
