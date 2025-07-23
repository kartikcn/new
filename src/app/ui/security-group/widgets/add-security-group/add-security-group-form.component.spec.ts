import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSecurityGroupFormComponent } from './add-security-group-form.component';

describe('AddSecurityGroupFormComponent', () => {
  let component: AddSecurityGroupFormComponent;
  let fixture: ComponentFixture<AddSecurityGroupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSecurityGroupFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSecurityGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
