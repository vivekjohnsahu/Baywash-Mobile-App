import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular';
import { NgxSpinnerModule } from 'ngx-spinner';
import { GuestReassignPage } from './guest-reassign.page';

const routes: Routes = [
  {
    path: '',
    component: GuestReassignPage
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
  declarations: [GuestReassignPage]
})
export class GuestReassignPageModule {}
