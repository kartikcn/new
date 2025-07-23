import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogintrythatComponent } from './logintrythat.component';

describe('LogintrythatComponent', () => {
  let component: LogintrythatComponent;
  let fixture: ComponentFixture<LogintrythatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogintrythatComponent]
    });
    fixture = TestBed.createComponent(LogintrythatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
