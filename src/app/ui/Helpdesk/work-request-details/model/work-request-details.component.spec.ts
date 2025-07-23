import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkRequestDetailsComponent } from './work-request-details.component';

describe('WorkRequestDetailsComponent', () => {
  let component: WorkRequestDetailsComponent;
  let fixture: ComponentFixture<WorkRequestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkRequestDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
