import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSiteItemComponent } from './add-site-item.component';

describe('AddSiteItemComponent', () => {
  let component: AddSiteItemComponent;
  let fixture: ComponentFixture<AddSiteItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSiteItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSiteItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
