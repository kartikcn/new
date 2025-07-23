import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestDocumentsComponent } from './request-documents.component';

describe('RequestDocumentsComponent', () => {
  let component: RequestDocumentsComponent;
  let fixture: ComponentFixture<RequestDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestDocumentsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
