import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditResourcesFormComponent } from './add-edit-resources-form.component';

describe('AddEditResourcesFormComponent', () => {
  let component: AddEditResourcesFormComponent;
  let fixture: ComponentFixture<AddEditResourcesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditResourcesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditResourcesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
