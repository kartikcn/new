import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceTeamComponent } from './space-team.component';

describe('SpaceTeamComponent', () => {
  let component: SpaceTeamComponent;
  let fixture: ComponentFixture<SpaceTeamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpaceTeamComponent]
    });
    fixture = TestBed.createComponent(SpaceTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
