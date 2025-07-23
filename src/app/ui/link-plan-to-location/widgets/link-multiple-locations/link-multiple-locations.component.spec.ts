import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkMultipleLocationsComponent } from './link-multiple-locations.component';

describe('LinkMultipleLocationsComponent', () => {
  let component: LinkMultipleLocationsComponent;
  let fixture: ComponentFixture<LinkMultipleLocationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkMultipleLocationsComponent]
    });
    fixture = TestBed.createComponent(LinkMultipleLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
