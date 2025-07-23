import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceAssignScreenComponent } from './resource-assign-screen.component';

describe('ResourceAssignScreenComponent', () => {
  let component: ResourceAssignScreenComponent;
  let fixture: ComponentFixture<ResourceAssignScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceAssignScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceAssignScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
