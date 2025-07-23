import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightByDivisionComponent } from './highlight-by-division.component';

describe('HighlightByDivisionComponent', () => {
  let component: HighlightByDivisionComponent;
  let fixture: ComponentFixture<HighlightByDivisionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HighlightByDivisionComponent]
    });
    fixture = TestBed.createComponent(HighlightByDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
