import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCraftspersonFormComponent } from './add-craftsperson-form.component';

describe('AddCraftspersonFormComponent', () => {
  let component: AddCraftspersonFormComponent;
  let fixture: ComponentFixture<AddCraftspersonFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddCraftspersonFormComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCraftspersonFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
