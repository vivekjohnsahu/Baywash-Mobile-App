import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NgxSpinnerModule } from 'ngx-spinner';
import { GuestScheduleManagementPage } from './guest-schedule-management.page';
import { FilterGuestSchedulePage } from '../filter-guest-schedule/filter-guest-schedule.page';
import { ReactiveFormsModule } from '@angular/forms'
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';

const routes: Routes = [
  {
    path: '',
    component: GuestScheduleManagementPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    NgxSpinnerModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
  ],
  providers: [
    // added to providers array
    Printer,
  ],
  declarations: [GuestScheduleManagementPage,FilterGuestSchedulePage],
  entryComponents: [FilterGuestSchedulePage],
})
export class GuestScheduleManagementPageModule {}
