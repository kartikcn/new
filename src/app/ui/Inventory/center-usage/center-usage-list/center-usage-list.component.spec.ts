import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterUsageListComponent } from './center-usage-list.component';

describe('CenterUsageListComponent', () => {
  let component: CenterUsageListComponent;
  let fixture: ComponentFixture<CenterUsageListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CenterUsageListComponent]
    });
    fixture = TestBed.createComponent(CenterUsageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
