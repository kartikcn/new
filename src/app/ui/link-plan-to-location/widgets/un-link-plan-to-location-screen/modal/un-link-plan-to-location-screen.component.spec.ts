import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnLinkPlanToLocationScreenComponent } from './un-link-plan-to-location-screen.component';

describe('UnLinkPlanToLocationScreenComponent', () => {
  let component: UnLinkPlanToLocationScreenComponent;
  let fixture: ComponentFixture<UnLinkPlanToLocationScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnLinkPlanToLocationScreenComponent]
    });
    fixture = TestBed.createComponent(UnLinkPlanToLocationScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
