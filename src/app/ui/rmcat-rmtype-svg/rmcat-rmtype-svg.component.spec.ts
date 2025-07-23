import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmcatRmtypeSvgComponent } from './rmcat-rmtype-svg.component';

describe('RmcatRmtypeSvgComponent', () => {
  let component: RmcatRmtypeSvgComponent;
  let fixture: ComponentFixture<RmcatRmtypeSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RmcatRmtypeSvgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RmcatRmtypeSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
