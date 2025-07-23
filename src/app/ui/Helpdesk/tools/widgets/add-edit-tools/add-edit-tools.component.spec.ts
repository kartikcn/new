import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditToolsComponent } from './add-edit-tools.component';

describe('AddEditToolsComponent', () => {
  let component: AddEditToolsComponent;
  let fixture: ComponentFixture<AddEditToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditToolsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
