import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { FilterGuestSchedulePage } from './filter-guest-schedule.page';

const routes: Routes = [
  {
    path: '',
    component: FilterGuestSchedulePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    Ng2SearchPipeModule
  ],
  declarations: [FilterGuestSchedulePage]
})
export class FilterGuestSchedulePageModule {}

