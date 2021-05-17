import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestReassignPage } from './guest-reassign.page';

describe('GuestReassignPage', () => {
  let component: GuestReassignPage;
  let fixture: ComponentFixture<GuestReassignPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestReassignPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestReassignPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
