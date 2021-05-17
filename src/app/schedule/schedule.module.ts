import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SchedulePage } from './schedule.page';
import { FilterWorkerManagementPage } from '../filter-worker-management/filter-worker-management.page';

const routes: Routes = [
  {
    path: '',
    component: SchedulePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxSpinnerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SchedulePage,FilterWorkerManagementPage],
  entryComponents: [FilterWorkerManagementPage]
})
export class SchedulePageModule {}
