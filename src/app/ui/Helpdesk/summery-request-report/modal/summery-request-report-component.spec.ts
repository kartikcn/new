import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummeryRequestReportsComponent } from './summery-request-report.component';

describe('FecilitiesHelpDeskReportsComponent', () => {
  let component: SummeryRequestReportsComponent;
  let fixture: ComponentFixture<SummeryRequestReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SummeryRequestReportsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummeryRequestReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
