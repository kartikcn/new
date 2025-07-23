import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateRequestsComponent } from './generate-requests.component';

describe('GenerateRequestsComponent', () => {
  let component: GenerateRequestsComponent;
  let fixture: ComponentFixture<GenerateRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateRequestsComponent]
    });
    fixture = TestBed.createComponent(GenerateRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
