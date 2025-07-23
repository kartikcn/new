import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEqFormComponent } from './add-eq-form.component';

describe('AddEqFormComponent', () => {
  let component: AddEqFormComponent;
  let fixture: ComponentFixture<AddEqFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEqFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEqFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
