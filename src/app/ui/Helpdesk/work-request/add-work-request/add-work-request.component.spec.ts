import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkRequestComponent } from './add-work-request.component';

describe('AddWorkRequestComponent', () => {
  let component: AddWorkRequestComponent;
  let fixture: ComponentFixture<AddWorkRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddWorkRequestComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorkRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
