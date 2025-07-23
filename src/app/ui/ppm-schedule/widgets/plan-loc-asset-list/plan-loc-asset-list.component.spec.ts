import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanLocAssetListComponent } from './plan-loc-asset-list.component';

describe('PlanLocAssetListComponent', () => {
  let component: PlanLocAssetListComponent;
  let fixture: ComponentFixture<PlanLocAssetListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanLocAssetListComponent]
    });
    fixture = TestBed.createComponent(PlanLocAssetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
