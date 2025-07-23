import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDeskProblemDescriptionComponent } from './help-desk-problem-description.component';

describe('HelpDeskProblemDescriptionComponent', () => {
  let component: HelpDeskProblemDescriptionComponent;
  let fixture: ComponentFixture<HelpDeskProblemDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpDeskProblemDescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpDeskProblemDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
