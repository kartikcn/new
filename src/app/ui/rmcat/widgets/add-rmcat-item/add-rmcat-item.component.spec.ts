import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRmcatItemComponent } from './add-rmcat-item.component';

describe('AddRmcatItemComponent', () => {
  let component: AddRmcatItemComponent;
  let fixture: ComponentFixture<AddRmcatItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRmcatItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRmcatItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
