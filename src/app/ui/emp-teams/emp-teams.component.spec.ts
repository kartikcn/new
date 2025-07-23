import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpTeamsComponent } from './emp-teams.component';

describe('EmpTeamsComponent', () => {
  let component: EmpTeamsComponent;
  let fixture: ComponentFixture<EmpTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpTeamsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
