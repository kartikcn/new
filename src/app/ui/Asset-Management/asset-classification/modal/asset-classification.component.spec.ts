import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetClassificationComponent } from './asset-classification.component';

describe('AssetClassificationComponent', () => {
  let component: AssetClassificationComponent;
  let fixture: ComponentFixture<AssetClassificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssetClassificationComponent]
    });
    fixture = TestBed.createComponent(AssetClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
