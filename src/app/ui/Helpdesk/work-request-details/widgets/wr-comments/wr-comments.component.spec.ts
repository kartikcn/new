import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrCommentsComponent } from './wr-comments.component';

describe('WrCommentsComponent', () => {
  let component: WrCommentsComponent;
  let fixture: ComponentFixture<WrCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrCommentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
