import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular';

import { AddCustomerPage } from './add-customer.page';
import { NgxSpinnerModule } from 'ngx-spinner';

const routes: Routes = [
  {
    path: '',
    component: AddCustomerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddCustomerPage]
})
export class AddCustomerPageModule {}
