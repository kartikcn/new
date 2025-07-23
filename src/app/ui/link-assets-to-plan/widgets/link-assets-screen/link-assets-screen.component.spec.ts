import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkAssetsScreenComponent } from './link-assets-screen.component';

describe('LinkAssetsScreenComponent', () => {
  let component: LinkAssetsScreenComponent;
  let fixture: ComponentFixture<LinkAssetsScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkAssetsScreenComponent]
    });
    fixture = TestBed.createComponent(LinkAssetsScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
