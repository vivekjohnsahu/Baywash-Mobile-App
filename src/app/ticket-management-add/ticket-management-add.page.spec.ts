import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketManagementAddPage } from './ticket-management-add.page';

describe('TicketManagementAddPage', () => {
  let component: TicketManagementAddPage;
  let fixture: ComponentFixture<TicketManagementAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketManagementAddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketManagementAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
