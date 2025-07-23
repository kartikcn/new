import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEditWorkRequestComponent } from './view-edit-work-request.component';

describe('ViewEditWorkRequestComponent', () => {
  let component: ViewEditWorkRequestComponent;
  let fixture: ComponentFixture<ViewEditWorkRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEditWorkRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEditWorkRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
