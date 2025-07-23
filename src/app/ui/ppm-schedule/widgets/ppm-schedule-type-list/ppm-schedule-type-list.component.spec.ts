import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpmScheduleTypeListComponent } from './ppm-schedule-type-list.component';

describe('PpmScheduleTypeListComponent', () => {
  let component: PpmScheduleTypeListComponent;
  let fixture: ComponentFixture<PpmScheduleTypeListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PpmScheduleTypeListComponent]
    });
    fixture = TestBed.createComponent(PpmScheduleTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
