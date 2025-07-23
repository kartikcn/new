import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkPlanToLocationScreenComponent } from './link-plan-to-location-screen.component';

describe('LinkPlanToLocationScreenComponent', () => {
  let component: LinkPlanToLocationScreenComponent;
  let fixture: ComponentFixture<LinkPlanToLocationScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkPlanToLocationScreenComponent]
    });
    fixture = TestBed.createComponent(LinkPlanToLocationScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
