import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSecurityGroupComponent } from './user-security-group.component';

describe('UserSecurityGroupComponent', () => {
  let component: UserSecurityGroupComponent;
  let fixture: ComponentFixture<UserSecurityGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserSecurityGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSecurityGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
