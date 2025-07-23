import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestToolsComponent } from './request-tools.component';

describe('RequestToolsComponent', () => {
  let component: RequestToolsComponent;
  let fixture: ComponentFixture<RequestToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestToolsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
