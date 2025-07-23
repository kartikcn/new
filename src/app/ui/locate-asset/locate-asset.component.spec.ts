import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocateAssetComponent } from './locate-asset.component';

describe('LocateAssetComponent', () => {
  let component: LocateAssetComponent;
  let fixture: ComponentFixture<LocateAssetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocateAssetComponent]
    });
    fixture = TestBed.createComponent(LocateAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
