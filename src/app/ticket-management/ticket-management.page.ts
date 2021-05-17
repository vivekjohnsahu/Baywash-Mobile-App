import { Component, OnInit } from '@angular/core';
import {GlobleServiceService} from '../globle-service.service'
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AlertController, Events, MenuController, Platform } from '@ionic/angular';
import { AppComponent } from '../app.component'
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { FilterTicketPage } from '../filter-ticket/filter-ticket.page';
import { ModalController } from '@ionic/angular';
import { NotificationPage } from '../notification/notification.page';

@Component({
  selector: 'app-ticket-management',
  templateUrl: './ticket-management.page.html',
  styleUrls: ['./ticket-management.page.scss'],
})
export class TicketManagementPage implements OnInit {

	user_details:any;
	society:any;
	drop_down_priority:any;
	drop_down_select:any;
	worker_details_hide=1; 
	ticket:any;
	modelShowStatusa=false
	information:any;
	status_change:any;
	ticket_id:any;
	statusSelect:any;
	dateSelect:any;
	filterSelectvls='';
	customPickerOptions: any;
	worker_list: any;
	customers_listing: any;
	filter_Data_return: any;
	user_id: any;
	noti_count: any;
	type_input=false
	customer_input=false
	worker_input=false
	priority_input=false
	customer_id=undefined;
	priority_id=undefined;
	type_id=undefined;
	worker_id=undefined;
		
	constructor(
		private router : Router, 
		private globleServiceService:GlobleServiceService,
		private storage:Storage,
		public alertController:AlertController,
		public events: Events,
		private appComponent:AppComponent,
		private spinner: NgxSpinnerService,
		private routers:ActivatedRoute,
		public toastController:ToastController,
		public modalController:ModalController
	){}

  	ngOnInit() {}

  	ionViewWillEnter(){
		this.storage.get('user_details').then((val) => {
			this.user_details = val;
			this.user_id = val.user_id
			this.ticket_management_list()
			this.weellCount()
		})
	}

	// Ticket list
	ticket_management_list(){
		this.worker_details_hide=1; 
		this.spinner.show()
		this.storage.get('user_details').then((val) => {
		this.user_details = val;
			let key = {
				apikey:this.globleServiceService.apikey,
				user_id:this.user_id,
				society_id:this.user_details.society,
			}
			this.globleServiceService.GlobalHit(key,'ticket_list').
			then(async data=>{
				this.spinner.hide()
				if(data['customer_list'].ticket_list==false){
					this.worker_details_hide=0
					this.society=data['customer_list'].socity
				}else{
					this.society=data['customer_list'].socity
					this.ticket=data['customer_list'].ticket_list
				}
			})
		});
	}

 	// Add ticket page
	add_ticket(){
		this.router.navigateByUrl('/ticket-management-add')
		this.storage.remove('filter_value')
	}
	
	// Ticket details go to ticket details page
	ticket_details(id){
		this.router.navigateByUrl('/ticket-details/'+id)
		this.storage.remove('filter_value')
	}

	valueAlreadySey
	openModel(event,vls,id){
		event.stopPropagation();
		this.valueAlreadySey=vls
		this.status_change=vls
		this.modelShowStatusa=true;
		this.ticket_id=id
	}

	openModel1(event){
		event.stopPropagation();
	}

	openModelHide(){
		this.modelShowStatusa=false;
	}

	async submitPopup(){
		if(this.status_change==this.valueAlreadySey){
			const toast = await this.toastController.create({
				message: 'This status is already updated',
				color: 'danger',
				position:'bottom',
				duration: 2000,
			});
			toast.present();
		}else{
			let key ={
				apikey:this.globleServiceService.apikey,
				ticket_id:this.ticket_id,
				status:this.status_change,
				comment:this.information
			}
			this.globleServiceService.GlobalHit(key,'update_ticket_status').
			then(data=>{
				this.spinner.hide()
				this.alertMsgsuccess(data['message'])
				console.log(this.filter_Data_return)
				if(this.filter_Data_return==undefined){
					console.log('3')
					this.ticket_management_list()
					// this.filterActiveInactive(this.filter_Data_return)
				}else{
					console.log('4')
					this.filterActiveInactive(this.filter_Data_return)
					// this.ticket_management_list()
				}
				this.modelShowStatusa=false;
				this.information=''
			})
		}
	}

	userStatus(vls){
		this.status_change=vls
	}

	async alertMsgsuccess(error_msg_show){
		const toast = await this.toastController.create({
			message: error_msg_show,
			color: 'success',
			position:'bottom',
			duration: 2000,
		});
		toast.present();
	}

	back(){
		this.storage.remove('filter_value')
	}

	async filterList(){
		this.spinner.show()
		const modal = await this.modalController.create({
			component: FilterTicketPage
		})
		await modal.present();
		this.spinner.hide()
		const { data } = await modal.onWillDismiss();
		this.filter_Data_return=data
		if(this.filter_Data_return!='reset'){
			console.log('1')
			this.filterActiveInactive(this.filter_Data_return)
		}else{
			console.log('2')
			this.ticket_management_list()
		}
	}

	filterActiveInactive(data){
		this.spinner.show()
		this.storage.get('user_details').then((val) => {
		this.user_details = val;
			let key ={
				apikey:this.globleServiceService.apikey,
				user_id:this.user_id,
				society_id:this.user_details.society,
				status:data.status,
				created_date:data.date,
				customer_id:data.customer,
				worker_id:data.worker,
				priority:data.priority,
				ticket_type:data.type,
				s_date:data.form_date,
				e_date: data.to_date,
			}
			this.globleServiceService.GlobalHit(key,'ticket_list').
			then(data=>{
				this.spinner.hide()
				if(data['customer_list'].ticket_list==false){
					this.worker_details_hide=0
				}else{
					this.worker_details_hide=1
					this.ticket=data['customer_list'].ticket_list
				}
			})
		})
	}

	weellCount(){
		let key={
			user_id :this.user_details.user_id,
			society :this.user_details.society,
			apikey:this.globleServiceService.apikey,
		}
		this.globleServiceService.GlobalHit(key,'notification_count ').
		then(data=>{
			this.noti_count=data['notification_count'].count_of_new_notification
		})
	}
	
	async presentModal(){
        const modal = await this.modalController.create({
        component: NotificationPage
        });
		await modal.present();
		const { data } = await modal.onWillDismiss();
		this.weellCount()
	}

}
