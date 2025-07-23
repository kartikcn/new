import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTradesFormComponent } from './add-trades-form.component';

describe('AddTradesFormComponent', () => {
  let component: AddTradesFormComponent;
  let fixture: ComponentFixture<AddTradesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTradesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTradesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
