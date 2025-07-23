import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightByRmtypeComponent } from './highlight-by-rmtype.component';

describe('HighlightByRmtypeComponent', () => {
  let component: HighlightByRmtypeComponent;
  let fixture: ComponentFixture<HighlightByRmtypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HighlightByRmtypeComponent]
    });
    fixture = TestBed.createComponent(HighlightByRmtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
