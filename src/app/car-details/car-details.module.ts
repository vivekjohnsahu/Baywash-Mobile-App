import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CarDetailsPage } from './car-details.page';
import { NgxSpinnerModule } from 'ngx-spinner';

const routes: Routes = [
  {
    path: '',
    component: CarDetailsPage
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
  declarations: [CarDetailsPage]
})
export class CarDetailsPageModule {}
