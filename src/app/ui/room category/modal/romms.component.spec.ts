import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RommsComponent } from './romms.component';

describe('RommsComponent', () => {
  let component: RommsComponent;
  let fixture: ComponentFixture<RommsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RommsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RommsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
