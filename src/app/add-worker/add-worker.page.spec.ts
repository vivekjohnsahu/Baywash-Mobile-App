import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkerPage } from './add-worker.page';

describe('AddWorkerPage', () => {
  let component: AddWorkerPage;
  let fixture: ComponentFixture<AddWorkerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddWorkerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorkerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
