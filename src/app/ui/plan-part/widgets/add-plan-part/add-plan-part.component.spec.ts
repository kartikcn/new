import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlanPartComponent } from './add-plan-part.component';

describe('AddPlanPartComponent', () => {
  let component: AddPlanPartComponent;
  let fixture: ComponentFixture<AddPlanPartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPlanPartComponent]
    });
    fixture = TestBed.createComponent(AddPlanPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
