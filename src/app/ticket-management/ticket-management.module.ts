import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FilterTicketPage } from '../filter-ticket/filter-ticket.page';
import { TicketManagementPage } from './ticket-management.page';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReactiveFormsModule } from '@angular/forms'
import { Ng2SearchPipeModule } from 'ng2-search-filter';

const routes: Routes = [
  {
    path: '',
    component: TicketManagementPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxSpinnerModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    Ng2SearchPipeModule,
  ],
  declarations: [TicketManagementPage,FilterTicketPage],
  entryComponents: [FilterTicketPage],
})
export class TicketManagementPageModule {}
