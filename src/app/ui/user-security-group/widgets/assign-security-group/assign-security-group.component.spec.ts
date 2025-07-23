import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignSecurityGroupComponent } from './assign-security-group.component';

describe('AssignSecurityGroupComponent', () => {
  let component: AssignSecurityGroupComponent;
  let fixture: ComponentFixture<AssignSecurityGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignSecurityGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignSecurityGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
