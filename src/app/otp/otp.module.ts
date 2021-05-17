import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms'
import { NgxSpinnerModule } from 'ngx-spinner';

import { OtpPage } from './otp.page';

const routes: Routes = [
  {
    path: '',
    component: OtpPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OtpPage]
})
export class OtpPageModule {}
