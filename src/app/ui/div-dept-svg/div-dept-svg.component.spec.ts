import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivDeptSvgComponent } from './div-dept-svg.component';

describe('DivDeptSvgComponent', () => {
  let component: DivDeptSvgComponent;
  let fixture: ComponentFixture<DivDeptSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DivDeptSvgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DivDeptSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
