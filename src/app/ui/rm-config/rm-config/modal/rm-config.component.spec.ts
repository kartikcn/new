import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmConfigComponent } from './rm-config.component';

describe('RmConfigComponent', () => {
  let component: RmConfigComponent;
  let fixture: ComponentFixture<RmConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RmConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RmConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
