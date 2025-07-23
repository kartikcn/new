import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmcatComponent } from './rmcat.component';

describe('RmcatComponent', () => {
  let component: RmcatComponent;
  let fixture: ComponentFixture<RmcatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RmcatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RmcatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
