import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRmcatFortreeComponent } from './add-rmcat-fortree.component';

describe('AddRmcatFortreeComponent', () => {
  let component: AddRmcatFortreeComponent;
  let fixture: ComponentFixture<AddRmcatFortreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRmcatFortreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRmcatFortreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
