import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCosttypeComponent } from './add-edit-costtype.component';

describe('AddEditCosttypeComponent', () => {
  let component: AddEditCosttypeComponent;
  let fixture: ComponentFixture<AddEditCosttypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditCosttypeComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCosttypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
