import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCosttypeComponent } from './add-costtype.component';

describe('AddCosttypeComponent', () => {
  let component: AddCosttypeComponent;
  let fixture: ComponentFixture<AddCosttypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddCosttypeComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCosttypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
