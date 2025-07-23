import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMessagesComponent } from './add-arrangement.component';

describe('AddMessagesComponent', () => {
  let component: AddMessagesComponent;
  let fixture: ComponentFixture<AddMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMessagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
