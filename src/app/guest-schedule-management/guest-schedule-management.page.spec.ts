import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestScheduleManagementPage } from './guest-schedule-management.page';

describe('GuestScheduleManagementPage', () => {
  let component: GuestScheduleManagementPage;
  let fixture: ComponentFixture<GuestScheduleManagementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestScheduleManagementPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestScheduleManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
