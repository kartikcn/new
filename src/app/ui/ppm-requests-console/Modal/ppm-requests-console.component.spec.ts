import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpmRequestsConsoleComponent } from './ppm-requests-console.component';

describe('PpmRequestsConsoleComponent', () => {
  let component: PpmRequestsConsoleComponent;
  let fixture: ComponentFixture<PpmRequestsConsoleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PpmRequestsConsoleComponent]
    });
    fixture = TestBed.createComponent(PpmRequestsConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
