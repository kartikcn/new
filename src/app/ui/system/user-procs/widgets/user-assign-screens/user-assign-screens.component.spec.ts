import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAssignScreensComponent } from './user-assign-screens.component';

describe('UserAssignScreensComponent', () => {
  let component: UserAssignScreensComponent;
  let fixture: ComponentFixture<UserAssignScreensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAssignScreensComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAssignScreensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
