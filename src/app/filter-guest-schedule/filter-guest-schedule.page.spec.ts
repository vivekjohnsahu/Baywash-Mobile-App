import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterGuestSchedulePage } from './filter-guest-schedule.page';

describe('FilterGuestSchedulePage', () => {
  let component: FilterGuestSchedulePage;
  let fixture: ComponentFixture<FilterGuestSchedulePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterGuestSchedulePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterGuestSchedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
