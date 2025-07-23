import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditRequestPartsComponent } from './add-edit-request-parts.component';

describe('AddEditRequestPartsComponent', () => {
  let component: AddEditRequestPartsComponent;
  let fixture: ComponentFixture<AddEditRequestPartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditRequestPartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditRequestPartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
