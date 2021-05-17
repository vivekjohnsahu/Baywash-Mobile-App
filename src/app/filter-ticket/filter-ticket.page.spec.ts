import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterTicketPage } from './filter-ticket.page';

describe('FilterTicketPage', () => {
  let component: FilterTicketPage;
  let fixture: ComponentFixture<FilterTicketPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterTicketPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterTicketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
