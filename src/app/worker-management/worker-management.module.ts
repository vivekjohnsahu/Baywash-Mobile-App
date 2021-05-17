import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { WorkerManagementPage } from './worker-management.page';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CalendarModule } from 'ion2-calendar';

const routes: Routes = [
  {
    path: '',
    component: WorkerManagementPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxSpinnerModule,
    RouterModule.forChild(routes),
    CalendarModule
  ],
  declarations: [WorkerManagementPage],
})
export class WorkerManagementPageModule {}
