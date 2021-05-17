import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerManagementPage } from './worker-management.page';

describe('WorkerManagementPage', () => {
  let component: WorkerManagementPage;
  let fixture: ComponentFixture<WorkerManagementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkerManagementPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkerManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
