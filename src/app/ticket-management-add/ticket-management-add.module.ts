import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms'

import { TicketManagementAddPage } from './ticket-management-add.page';
import { NgxSpinnerModule } from 'ngx-spinner';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Keyboard } from '@ionic-native/keyboard/ngx';

const routes: Routes = [
  {
    path: '',
    component: TicketManagementAddPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    IonicModule,
    Ng2SearchPipeModule,
    RouterModule.forChild(routes)
  ],
  providers:[Keyboard],
  declarations: [TicketManagementAddPage]
})
export class TicketManagementAddPageModule {}
