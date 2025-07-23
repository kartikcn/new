import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRmtypeFortreeComponent } from './add-rmtype-fortree.component';

describe('AddRmtypeFortreeComponent', () => {
  let component: AddRmtypeFortreeComponent;
  let fixture: ComponentFixture<AddRmtypeFortreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRmtypeFortreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRmtypeFortreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
