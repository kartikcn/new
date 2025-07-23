import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmConfigListComponent } from './rm-config-list.component';

describe('RmConfigListComponent', () => {
  let component: RmConfigListComponent;
  let fixture: ComponentFixture<RmConfigListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RmConfigListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RmConfigListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
