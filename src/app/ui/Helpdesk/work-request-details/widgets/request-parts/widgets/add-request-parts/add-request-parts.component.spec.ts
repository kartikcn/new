import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRequestPartsComponent } from './add-request-parts.component';

describe('AddRequestPartsComponent', () => {
  let component: AddRequestPartsComponent;
  let fixture: ComponentFixture<AddRequestPartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRequestPartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRequestPartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
