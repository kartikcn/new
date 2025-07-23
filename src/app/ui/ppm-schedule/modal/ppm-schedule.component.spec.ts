import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpmScheduleComponent } from './ppm-schedule.component';

describe('PpmScheduleComponent', () => {
  let component: PpmScheduleComponent;
  let fixture: ComponentFixture<PpmScheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PpmScheduleComponent]
    });
    fixture = TestBed.createComponent(PpmScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
