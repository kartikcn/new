import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsUsageAnalysisComponent } from './parts-usage-analysis.component';

describe('PartsUsageAnalysisComponent', () => {
  let component: PartsUsageAnalysisComponent;
  let fixture: ComponentFixture<PartsUsageAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartsUsageAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartsUsageAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
