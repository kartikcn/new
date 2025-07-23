import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmConfigFormComponent } from './rm-config-form.component';

describe('RmConfigFormComponent', () => {
  let component: RmConfigFormComponent;
  let fixture: ComponentFixture<RmConfigFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RmConfigFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RmConfigFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
