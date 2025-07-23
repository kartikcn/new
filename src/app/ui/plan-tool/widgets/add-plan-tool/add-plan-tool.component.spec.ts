import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlanToolComponent } from './add-plan-tool.component';

describe('AddPlanToolComponent', () => {
  let component: AddPlanToolComponent;
  let fixture: ComponentFixture<AddPlanToolComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPlanToolComponent]
    });
    fixture = TestBed.createComponent(AddPlanToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
