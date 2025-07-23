import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightByDepartmentComponent } from './highlight-by-department.component';

describe('HighlightByDepartmentComponent', () => {
  let component: HighlightByDepartmentComponent;
  let fixture: ComponentFixture<HighlightByDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighlightByDepartmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HighlightByDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
