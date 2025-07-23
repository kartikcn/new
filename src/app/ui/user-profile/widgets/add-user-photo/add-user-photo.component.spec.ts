import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserPhotoComponent } from './add-user-photo.component';

describe('AddUserPhotoComponent', () => {
  let component: AddUserPhotoComponent;
  let fixture: ComponentFixture<AddUserPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUserPhotoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
