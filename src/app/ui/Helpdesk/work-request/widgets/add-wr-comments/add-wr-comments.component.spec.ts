import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWrCommentsComponent } from './add-wr-comments.component';

describe('AddWrCommentsComponent', () => {
  let component: AddWrCommentsComponent;
  let fixture: ComponentFixture<AddWrCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWrCommentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWrCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
