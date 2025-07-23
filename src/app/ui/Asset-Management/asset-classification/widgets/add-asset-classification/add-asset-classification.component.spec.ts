import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssetClassificationComponent } from './add-asset-classification.component';

describe('AddAssetClassificationComponent', () => {
  let component: AddAssetClassificationComponent;
  let fixture: ComponentFixture<AddAssetClassificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddAssetClassificationComponent]
    });
    fixture = TestBed.createComponent(AddAssetClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
