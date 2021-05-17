import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkTaskPage } from './mark-task.page';

describe('MarkTaskPage', () => {
  let component: MarkTaskPage;
  let fixture: ComponentFixture<MarkTaskPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkTaskPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkTaskPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
