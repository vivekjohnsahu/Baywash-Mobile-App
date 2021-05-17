import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { FilterRegularSchedulePage } from './filter-regular-schedule.page';

const routes: Routes = [
  {
    path: '',
    component: FilterRegularSchedulePage
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
  declarations: [FilterRegularSchedulePage]
})
export class FilterRegularSchedulePageModule {}
