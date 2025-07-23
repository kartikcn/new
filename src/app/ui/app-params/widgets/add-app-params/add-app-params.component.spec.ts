import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAppParamsComponent } from './add-app-params.component';

describe('AddAppParamsComponent', () => {
  let component: AddAppParamsComponent;
  let fixture: ComponentFixture<AddAppParamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAppParamsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAppParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
