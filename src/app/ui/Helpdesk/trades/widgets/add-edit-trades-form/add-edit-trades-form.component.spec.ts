import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTradesFormComponent } from './add-edit-trades-form.component';

describe('AddEditTradesFormComponent', () => {
  let component: AddEditTradesFormComponent;
  let fixture: ComponentFixture<AddEditTradesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditTradesFormComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditTradesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
