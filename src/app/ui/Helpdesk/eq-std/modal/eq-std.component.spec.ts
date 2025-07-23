import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EqStdComponent } from './eq-std.component';

describe('EqStdComponent', () => {
  let component: EqStdComponent;
  let fixture: ComponentFixture<EqStdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EqStdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EqStdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
