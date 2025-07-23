import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnAssignSecurityGroupComponent } from './un-assign-security-group.component';

describe('UnAssignSecurityGroupComponent', () => {
  let component: UnAssignSecurityGroupComponent;
  let fixture: ComponentFixture<UnAssignSecurityGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnAssignSecurityGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnAssignSecurityGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
