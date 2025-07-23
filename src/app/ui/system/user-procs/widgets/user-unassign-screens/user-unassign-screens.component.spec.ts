import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUnassignScreensComponent } from './user-unassign-screens.component';

describe('UserUnassignScreensComponent', () => {
  let component: UserUnassignScreensComponent;
  let fixture: ComponentFixture<UserUnassignScreensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserUnassignScreensComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserUnassignScreensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
