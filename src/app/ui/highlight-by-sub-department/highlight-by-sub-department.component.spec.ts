import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightBySubDepartmentComponent } from './highlight-by-sub-department.component';

describe('HighlightBySubDepartmentComponent', () => {
  let component: HighlightBySubDepartmentComponent;
  let fixture: ComponentFixture<HighlightBySubDepartmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HighlightBySubDepartmentComponent]
    });
    fixture = TestBed.createComponent(HighlightBySubDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
