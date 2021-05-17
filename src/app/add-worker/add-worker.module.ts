import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddWorkerPage } from './add-worker.page';
import { ReactiveFormsModule } from '@angular/forms'
import { NgxSpinnerModule } from 'ngx-spinner';

const routes: Routes = [
  {
    path: '',
    component: AddWorkerPage
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
  declarations: [AddWorkerPage]
})
export class AddWorkerPageModule {}
