import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSecurityGroupFormComponent } from './add-edit-security-group-form.component';

describe('AddEditSecurityGroupFormComponent', () => {
  let component: AddEditSecurityGroupFormComponent;
  let fixture: ComponentFixture<AddEditSecurityGroupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditSecurityGroupFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditSecurityGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
