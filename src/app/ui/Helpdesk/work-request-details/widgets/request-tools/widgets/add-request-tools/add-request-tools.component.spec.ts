import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRequestToolsComponent } from './add-request-tools.component';

describe('AddRequestToolsComponent', () => {
  let component: AddRequestToolsComponent;
  let fixture: ComponentFixture<AddRequestToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRequestToolsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRequestToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
