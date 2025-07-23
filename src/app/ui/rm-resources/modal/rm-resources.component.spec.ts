import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmResourcesComponent } from './rm-resources.component';

describe('RmResourcesComponent', () => {
  let component: RmResourcesComponent;
  let fixture: ComponentFixture<RmResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RmResourcesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RmResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
