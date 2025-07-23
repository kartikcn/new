import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpmPlansListComponent } from './ppm-plans-list.component';

describe('PpmPlansListComponent', () => {
  let component: PpmPlansListComponent;
  let fixture: ComponentFixture<PpmPlansListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PpmPlansListComponent]
    });
    fixture = TestBed.createComponent(PpmPlansListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
