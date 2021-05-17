import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerListingPage } from './customer-listing.page';

describe('CustomerListingPage', () => {
  let component: CustomerListingPage;
  let fixture: ComponentFixture<CustomerListingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerListingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerListingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
