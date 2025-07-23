import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRequestTechniciansComponent } from './add-request-technicians.component';

describe('AddRequestTechniciansComponent', () => {
  let component: AddRequestTechniciansComponent;
  let fixture: ComponentFixture<AddRequestTechniciansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRequestTechniciansComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRequestTechniciansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
