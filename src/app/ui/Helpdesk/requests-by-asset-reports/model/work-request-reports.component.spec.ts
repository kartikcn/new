import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkRequestReportsComponent } from './work-request-reports.component';

describe('WorkRequestReportsComponent', () => {
  let component: WorkRequestReportsComponent;
  let fixture: ComponentFixture<WorkRequestReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkRequestReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkRequestReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
