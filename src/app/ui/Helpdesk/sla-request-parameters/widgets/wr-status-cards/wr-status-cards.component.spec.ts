import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrStatusCardsComponent } from './wr-status-cards.component';

describe('WrStatusCardsComponent', () => {
  let component: WrStatusCardsComponent;
  let fixture: ComponentFixture<WrStatusCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrStatusCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrStatusCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
