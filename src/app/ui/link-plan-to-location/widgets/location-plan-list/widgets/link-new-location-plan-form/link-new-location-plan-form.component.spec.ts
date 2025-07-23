import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkNewLocationPlanFormComponent } from './link-new-location-plan-form.component';

describe('LinkNewLocationPlanFormComponent', () => {
  let component: LinkNewLocationPlanFormComponent;
  let fixture: ComponentFixture<LinkNewLocationPlanFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkNewLocationPlanFormComponent]
    });
    fixture = TestBed.createComponent(LinkNewLocationPlanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
