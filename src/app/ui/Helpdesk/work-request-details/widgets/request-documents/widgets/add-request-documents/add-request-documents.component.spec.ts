import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRequestDocumentsComponent } from './add-request-documents.component';

describe('AddRequestDocumentsComponent', () => {
  let component: AddRequestDocumentsComponent;
  let fixture: ComponentFixture<AddRequestDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddRequestDocumentsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRequestDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
