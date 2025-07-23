import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProcsComponent } from './user-procs.component';

describe('UserProcsComponent', () => {
  let component: UserProcsComponent;
  let fixture: ComponentFixture<UserProcsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserProcsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProcsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
