import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'login',
  //   pathMatch: 'full'
  // },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  { 
    path: 'notification', 
    loadChildren: './notification/notification.module#NotificationPageModule' 
  },
  { 
    path: 'login', 
    loadChildren: './login/login.module#LoginPageModule' 
  },
  { 
    path: 'otp', 
    loadChildren: './otp/otp.module#OtpPageModule' 
  },
  { 
    path: 'forgot-password', 
    loadChildren: './forgot-password/forgot-password.module#ForgotPasswordPageModule' 
  },
  { 
    path: 'customer-listing', 
    loadChildren: './customer-listing/customer-listing.module#CustomerListingPageModule' 
  },
  { 
    path: 'add-car', 
    loadChildren: './add-car/add-car.module#AddCarPageModule' 
  },
  { 
    path: 'add-car/:edit/:type/:cmt_id', 
    loadChildren: './add-car/add-car.module#AddCarPageModule' 
  },
  { 
    path: 'add-car/:morecar', 
    loadChildren: './add-car/add-car.module#AddCarPageModule' 
  },
  { 
    path: 'customer-details/:id/:type', 
    loadChildren: './customer-details/customer-details.module#CustomerDetailsPageModule' 
  },
  { 
    path: 'car-details/:id/:type/:cmt_id', 
    loadChildren: './car-details/car-details.module#CarDetailsPageModule' 
  },
  { 
    path: 'add-worker', 
    loadChildren: './add-worker/add-worker.module#AddWorkerPageModule'
  },
  { 
    path: 'worker-management', 
    loadChildren: './worker-management/worker-management.module#WorkerManagementPageModule'
  },
  { 
    path: 'worker-management/:id', 
    loadChildren: './worker-management/worker-management.module#WorkerManagementPageModule'
  },
  { 
    path: 'ticket-management', 
    loadChildren: './ticket-management/ticket-management.module#TicketManagementPageModule' 
  },
  { 
    path: 'ticket-management-add', 
    loadChildren: './ticket-management-add/ticket-management-add.module#TicketManagementAddPageModule' 
  },
  { 
    path: 'ticket-details/:id', 
    loadChildren: './ticket-details/ticket-details.module#TicketDetailsPageModule' 
  },
  { 
    path: 'mark-task/:id/:job_date/:workerName', 
    loadChildren: './mark-task/mark-task.module#MarkTaskPageModule' 
  },
  { 
    path: 'change-password', 
    loadChildren: './change-password/change-password.module#ChangePasswordPageModule' 
  },
  { path: 'schedule-management', loadChildren: './schedule-management/schedule-management.module#ScheduleManagementPageModule' },
  { path: 'schedule-management/:workerId/:job_date/:workerName', loadChildren: './schedule-management/schedule-management.module#ScheduleManagementPageModule' },
  { path: 'add-customer', loadChildren: './add-customer/add-customer.module#AddCustomerPageModule' },
  { path: 'add-customer/:edit/:type/:cmt_id', loadChildren: './add-customer/add-customer.module#AddCustomerPageModule' },
  { path: 'schedule', loadChildren: './schedule/schedule.module#SchedulePageModule' },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'discount-calculator/:user/:service/:car_type/:cmt_id', loadChildren: './discount-calculator/discount-calculator.module#DiscountCalculatorPageModule' },
  { path: 'discount-calculator/:user/:service/:monthly_service/:weekly_service/:car_type/:cmt_id', loadChildren: './discount-calculator/discount-calculator.module#DiscountCalculatorPageModule' },
  { path: 'reassign/:date/:id', loadChildren: './reassign/reassign.module#ReassignPageModule' },
  { path: 'guest-schedule-management/:workerId/:job_date/:workerName', loadChildren: './guest-schedule-management/guest-schedule-management.module#GuestScheduleManagementPageModule' },
  { path: 'guest-schedule-management', loadChildren: './guest-schedule-management/guest-schedule-management.module#GuestScheduleManagementPageModule' },
  { path: 'guest-reassign/:date/:id', loadChildren: './guest-reassign/guest-reassign.module#GuestReassignPageModule' },
  { path: 'filter-guest-schedule', loadChildren: './filter-guest-schedule/filter-guest-schedule.module#FilterGuestSchedulePageModule' },
  { path: 'filter-regular-schedule', loadChildren: './filter-regular-schedule/filter-regular-schedule.module#FilterRegularSchedulePageModule' },
  { path: 'filter-ticket', loadChildren: './filter-ticket/filter-ticket.module#FilterTicketPageModule' },
  { path: 'filter-worker-management', loadChildren: './filter-worker-management/filter-worker-management.module#FilterWorkerManagementPageModule' },
  { path: 'chat/:id', loadChildren: './chat/chat.module#ChatPageModule' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
