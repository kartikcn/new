import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpmScheduleTypeComponent } from './ppm-schedule-type.component';

describe('PpmScheduleTypeComponent', () => {
  let component: PpmScheduleTypeComponent;
  let fixture: ComponentFixture<PpmScheduleTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PpmScheduleTypeComponent]
    });
    fixture = TestBed.createComponent(PpmScheduleTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
