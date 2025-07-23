import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditRequestToolsComponent } from './add-edit-request-tools.component';

describe('AddEditRequestToolsComponent', () => {
  let component: AddEditRequestToolsComponent;
  let fixture: ComponentFixture<AddEditRequestToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditRequestToolsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditRequestToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
