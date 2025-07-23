import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAssetClassificationComponent } from './select-asset-classification.component';

describe('SelectAssetClassificationComponent', () => {
  let component: SelectAssetClassificationComponent;
  let fixture: ComponentFixture<SelectAssetClassificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectAssetClassificationComponent]
    });
    fixture = TestBed.createComponent(SelectAssetClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
