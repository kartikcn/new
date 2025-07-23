import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkPlanToAssetComponent } from './link-plan-to-asset.component';

describe('LinkPlanToAssetComponent', () => {
  let component: LinkPlanToAssetComponent;
  let fixture: ComponentFixture<LinkPlanToAssetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkPlanToAssetComponent]
    });
    fixture = TestBed.createComponent(LinkPlanToAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
