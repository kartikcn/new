import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnAssignTeamsComponent } from './un-assign-teams.component';

describe('UnAssignTeamsComponent', () => {
  let component: UnAssignTeamsComponent;
  let fixture: ComponentFixture<UnAssignTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnAssignTeamsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnAssignTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
