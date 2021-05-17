import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ScheduleManagementPage } from './schedule-management.page';
import { CalendarModule } from 'ion2-calendar';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FilterRegularSchedulePage } from '../filter-regular-schedule/filter-regular-schedule.page';
import { ReactiveFormsModule } from '@angular/forms'
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';

const routes: Routes = [
  {
    path: '',
    component: ScheduleManagementPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarModule,
    RouterModule.forChild(routes),
    NgxSpinnerModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule
  ],
  providers: [
    // added to providers array
    Printer,
  ],
  declarations: [ScheduleManagementPage,FilterRegularSchedulePage],
  entryComponents: [FilterRegularSchedulePage]
})
export class ScheduleManagementPageModule {}
