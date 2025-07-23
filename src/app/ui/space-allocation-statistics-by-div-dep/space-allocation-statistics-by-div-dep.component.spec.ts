import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceAllocationStatisticsByDivDepComponent } from './space-allocation-statistics-by-div-dep.component';

describe('SpaceAllocationStatisticsByDivDepComponent', () => {
  let component: SpaceAllocationStatisticsByDivDepComponent;
  let fixture: ComponentFixture<SpaceAllocationStatisticsByDivDepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpaceAllocationStatisticsByDivDepComponent]
    });
    fixture = TestBed.createComponent(SpaceAllocationStatisticsByDivDepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
