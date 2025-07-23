import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceUnassignScreenComponent } from './resource-unassign-screen.component';

describe('ResourceUnassignScreenComponent', () => {
  let component: ResourceUnassignScreenComponent;
  let fixture: ComponentFixture<ResourceUnassignScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceUnassignScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceUnassignScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
