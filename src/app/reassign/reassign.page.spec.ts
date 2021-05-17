import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReassignPage } from './reassign.page';

describe('ReassignPage', () => {
  let component: ReassignPage;
  let fixture: ComponentFixture<ReassignPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReassignPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReassignPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
