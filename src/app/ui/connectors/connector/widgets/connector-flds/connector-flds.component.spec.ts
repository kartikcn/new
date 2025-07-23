import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorFldsComponent } from './connector-flds.component';

describe('ConnectorFldsComponent', () => {
  let component: ConnectorFldsComponent;
  let fixture: ComponentFixture<ConnectorFldsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectorFldsComponent]
    });
    fixture = TestBed.createComponent(ConnectorFldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
