import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditVisitorsFormComponent } from './add-edit-visitors-form.component';

describe('AddEditVisitorsFormComponent', () => {
  let component: AddEditVisitorsFormComponent;
  let fixture: ComponentFixture<AddEditVisitorsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditVisitorsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditVisitorsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
