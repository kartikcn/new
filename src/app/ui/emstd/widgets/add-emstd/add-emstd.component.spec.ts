import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmstdComponent } from './add-emstd.component';

describe('AddEmstdComponent', () => {
  let component: AddEmstdComponent;
  let fixture: ComponentFixture<AddEmstdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEmstdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmstdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
