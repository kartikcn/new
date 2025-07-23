import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCraftspersonComponent } from './add-edit-craftsperson.component';

describe('AddEditCraftspersonComponent', () => {
  let component: AddEditCraftspersonComponent;
  let fixture: ComponentFixture<AddEditCraftspersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditCraftspersonComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCraftspersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
