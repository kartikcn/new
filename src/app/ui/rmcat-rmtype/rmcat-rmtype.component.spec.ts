import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmcatRmtypeComponent } from './rmcat-rmtype.component';

describe('RmcatRmtypeComponent', () => {
  let component: RmcatRmtypeComponent;
  let fixture: ComponentFixture<RmcatRmtypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RmcatRmtypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RmcatRmtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
