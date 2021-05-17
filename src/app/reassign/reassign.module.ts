import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReassignPage } from './reassign.page';
import {ScheduleManagementPage} from '../schedule-management/schedule-management.page';

const routes: Routes = [
  {
    path: '',
    component: ReassignPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    NgxSpinnerModule,
    ReactiveFormsModule
  ],
  declarations: [ReassignPage],
  providers:[ScheduleManagementPage]
})
export class ReassignPageModule {}
