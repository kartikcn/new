import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetWarrantyComponent } from './asset-warranty.component';

describe('AssetWarrantyComponent', () => {
  let component: AssetWarrantyComponent;
  let fixture: ComponentFixture<AssetWarrantyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssetWarrantyComponent]
    });
    fixture = TestBed.createComponent(AssetWarrantyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
