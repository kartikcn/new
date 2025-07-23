import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkPlanToLocationComponent } from './link-plan-to-location.component';

describe('LinkPlanToLocationComponent', () => {
  let component: LinkPlanToLocationComponent;
  let fixture: ComponentFixture<LinkPlanToLocationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkPlanToLocationComponent]
    });
    fixture = TestBed.createComponent(LinkPlanToLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
