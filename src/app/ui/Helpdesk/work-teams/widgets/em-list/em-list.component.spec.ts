import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmListComponent } from './em-list.component';

describe('EmListComponent', () => {
  let component: EmListComponent;
  let fixture: ComponentFixture<EmListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
