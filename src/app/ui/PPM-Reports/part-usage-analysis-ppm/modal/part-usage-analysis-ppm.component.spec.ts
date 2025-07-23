import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartUsageAnalysisPpmComponent } from './part-usage-analysis-ppm.component';

describe('PartUsageAnalysisPpmComponent', () => {
  let component: PartUsageAnalysisPpmComponent;
  let fixture: ComponentFixture<PartUsageAnalysisPpmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartUsageAnalysisPpmComponent]
    });
    fixture = TestBed.createComponent(PartUsageAnalysisPpmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
