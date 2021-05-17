import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterRegularSchedulePage } from './filter-regular-schedule.page';

describe('FilterRegularSchedulePage', () => {
  let component: FilterRegularSchedulePage;
  let fixture: ComponentFixture<FilterRegularSchedulePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterRegularSchedulePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterRegularSchedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
