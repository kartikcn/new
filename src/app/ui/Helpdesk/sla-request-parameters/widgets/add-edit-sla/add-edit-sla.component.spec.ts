import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSlaComponent } from './add-edit-sla.component';

describe('AddEditSlaComponent', () => {
  let component: AddEditSlaComponent;
  let fixture: ComponentFixture<AddEditSlaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditSlaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditSlaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
