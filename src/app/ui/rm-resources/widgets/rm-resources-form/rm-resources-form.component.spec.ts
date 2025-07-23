import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmResourcesFormComponent } from './rm-resources-form.component';

describe('RmResourcesFormComponent', () => {
  let component: RmResourcesFormComponent;
  let fixture: ComponentFixture<RmResourcesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RmResourcesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RmResourcesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
