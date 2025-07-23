import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditRmcatComponent } from './add-edit-rmcat.component';

describe('AddEditRmcatComponent', () => {
  let component: AddEditRmcatComponent;
  let fixture: ComponentFixture<AddEditRmcatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditRmcatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditRmcatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
