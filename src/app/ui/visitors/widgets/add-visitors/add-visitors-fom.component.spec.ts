import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVisitorsFomComponent } from './add-visitors-fom.component';

describe('AddVisitorsFomComponent', () => {
  let component: AddVisitorsFomComponent;
  let fixture: ComponentFixture<AddVisitorsFomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVisitorsFomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVisitorsFomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
