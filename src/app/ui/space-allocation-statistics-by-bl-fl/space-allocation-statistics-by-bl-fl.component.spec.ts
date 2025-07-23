import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceAllocationStatisticsByBlFlComponent } from './space-allocation-statistics-by-bl-fl.component';

describe('SpaceAllocationStatisticsByBlFlComponent', () => {
  let component: SpaceAllocationStatisticsByBlFlComponent;
  let fixture: ComponentFixture<SpaceAllocationStatisticsByBlFlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpaceAllocationStatisticsByBlFlComponent]
    });
    fixture = TestBed.createComponent(SpaceAllocationStatisticsByBlFlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
