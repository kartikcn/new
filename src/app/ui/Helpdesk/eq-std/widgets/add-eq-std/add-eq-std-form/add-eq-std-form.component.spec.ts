import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEqStdFormComponent } from './add-eq-std-form.component';

describe('AddEqStdFormComponent', () => {
  let component: AddEqStdFormComponent;
  let fixture: ComponentFixture<AddEqStdFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEqStdFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEqStdFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
