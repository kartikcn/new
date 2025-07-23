import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaRequestParametersComponent } from './sla-request-parameters.component';

describe('SlaRequestParametersComponent', () => {
  let component: SlaRequestParametersComponent;
  let fixture: ComponentFixture<SlaRequestParametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlaRequestParametersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaRequestParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
