import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetLocationComponent } from './asset-location.component';

describe('AssetLocationComponent', () => {
  let component: AssetLocationComponent;
  let fixture: ComponentFixture<AssetLocationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssetLocationComponent]
    });
    fixture = TestBed.createComponent(AssetLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
