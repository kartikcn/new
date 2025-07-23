import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetLeaseComponent } from './asset-lease.component';

describe('AssetLeaseComponent', () => {
  let component: AssetLeaseComponent;
  let fixture: ComponentFixture<AssetLeaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssetLeaseComponent]
    });
    fixture = TestBed.createComponent(AssetLeaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
