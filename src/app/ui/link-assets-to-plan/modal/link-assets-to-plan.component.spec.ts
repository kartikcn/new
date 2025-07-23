import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkAssetsToPlanComponent } from './link-assets-to-plan.component';

describe('LinkAssetsToPlanComponent', () => {
  let component: LinkAssetsToPlanComponent;
  let fixture: ComponentFixture<LinkAssetsToPlanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkAssetsToPlanComponent]
    });
    fixture = TestBed.createComponent(LinkAssetsToPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
