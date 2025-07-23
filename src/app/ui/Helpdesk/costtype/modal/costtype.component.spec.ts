import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CosttypeComponent } from './costtype.component';

describe('CosttypeComponent', () => {
  let component: CosttypeComponent;
  let fixture: ComponentFixture<CosttypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CosttypeComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CosttypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
