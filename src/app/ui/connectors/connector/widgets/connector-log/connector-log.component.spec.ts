import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorLogComponent } from './connector-log.component';

describe('ConnectorLogComponent', () => {
  let component: ConnectorLogComponent;
  let fixture: ComponentFixture<ConnectorLogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectorLogComponent]
    });
    fixture = TestBed.createComponent(ConnectorLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
