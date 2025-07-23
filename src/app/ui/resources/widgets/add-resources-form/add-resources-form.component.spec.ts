import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddResourcesFormComponent } from './add-resources-form.component';

describe('AddResourcesFormComponent', () => {
  let component: AddResourcesFormComponent;
  let fixture: ComponentFixture<AddResourcesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddResourcesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddResourcesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
