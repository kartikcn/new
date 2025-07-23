import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetInsuranceComponent } from './asset-insurance.component';

describe('AssetInsuranceComponent', () => {
  let component: AssetInsuranceComponent;
  let fixture: ComponentFixture<AssetInsuranceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssetInsuranceComponent]
    });
    fixture = TestBed.createComponent(AssetInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
