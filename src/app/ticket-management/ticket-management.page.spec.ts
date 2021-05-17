import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketManagementPage } from './ticket-management.page';

describe('TicketManagementPage', () => {
  let component: TicketManagementPage;
  let fixture: ComponentFixture<TicketManagementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketManagementPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
