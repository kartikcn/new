import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightByRmcatComponent } from './highlight-by-rmcat.component';

describe('HighlightByRmcatComponent', () => {
  let component: HighlightByRmcatComponent;
  let fixture: ComponentFixture<HighlightByRmcatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HighlightByRmcatComponent]
    });
    fixture = TestBed.createComponent(HighlightByRmcatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
