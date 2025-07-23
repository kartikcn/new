import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCommonAreaComponent } from './view-common-area.component';

describe('ViewCommonAreaComponent', () => {
  let component: ViewCommonAreaComponent;
  let fixture: ComponentFixture<ViewCommonAreaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewCommonAreaComponent]
    });
    fixture = TestBed.createComponent(ViewCommonAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
