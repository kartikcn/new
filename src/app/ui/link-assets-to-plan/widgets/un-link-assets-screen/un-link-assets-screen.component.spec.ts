import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnLinkAssetsScreenComponent } from './un-link-assets-screen.component';

describe('UnLinkAssetsScreenComponent', () => {
  let component: UnLinkAssetsScreenComponent;
  let fixture: ComponentFixture<UnLinkAssetsScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnLinkAssetsScreenComponent]
    });
    fixture = TestBed.createComponent(UnLinkAssetsScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
