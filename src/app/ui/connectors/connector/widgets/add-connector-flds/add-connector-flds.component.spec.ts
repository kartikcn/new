import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConnectorFldsComponent } from './add-connector-flds.component';

describe('AddConnectorFldsComponent', () => {
  let component: AddConnectorFldsComponent;
  let fixture: ComponentFixture<AddConnectorFldsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddConnectorFldsComponent]
    });
    fixture = TestBed.createComponent(AddConnectorFldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
