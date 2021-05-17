import { Component, OnInit } from '@angular/core';
import {GlobleServiceService} from '../globle-service.service'
import { Router, Navigation } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AlertController, Events, MenuController, Platform } from '@ionic/angular';
import { AppComponent } from '../app.component'
import { NgxSpinnerService } from 'ngx-spinner';
import * as $ from 'jquery';
import { ModalController } from '@ionic/angular';
import { NotificationPage } from '../notification/notification.page';

@Component({
  selector: 'app-customer-listing',
  templateUrl: './customer-listing.page.html',
  styleUrls: ['./customer-listing.page.scss'],
})
export class CustomerListingPage implements OnInit {

	user_details:any;
	society: any;
	customers: any;
	noti_count: any;
	drop_down_select: any;
	drop_down_inactive=1;
	worker_details_hide=1; 
	searchText='';
	customer_details_hide: number;
	radioChek=''

	constructor(
		private router : Router, 
		private globleServiceService:GlobleServiceService,
		private storage:Storage,
		public alertController:AlertController,
		public events: Events,
		private appComponent:AppComponent,
		private spinner: NgxSpinnerService,
		private modalController: ModalController,
	) {}

	ngOnInit() {}

	ionViewWillEnter(){
		this.customer_list()
	}
  
	customer_list(){
		this.customer_details_hide=1
		this.storage.get('user_details').then((val) => {
		this.user_details = val;
		this.weellCount()
		this.spinner.show()
			let key = {
				apikey:this.globleServiceService.apikey,
				user_id:this.user_details.user_id,
				access_token:this.user_details.access_token,
				society_id:this.user_details.society,
				customer_type:this.radioChek,
				search:this.searchText
			}
			this.globleServiceService.GlobalGetHit(key,'customer_list').
			then(async data=>{
				this.spinner.hide()
				if(data['customer_list'].customer_list==false){
					this.customer_details_hide=0
				}else{
					this.customer_details_hide=1
					this.customers=data['customer_list'].customer_list;
					this.society=data['customer_list'].socity;
				}
			})
		});
	}

  // filter active inactive function
	filterActiveInactive(vls){
		this.storage.get('user_details').then((val) => {
		this.user_details = val;
		let key = {
			apikey:this.globleServiceService.apikey,
			user_id:this.user_details.user_id,
			access_token:this.user_details.access_token,
			society_id:this.user_details.society,
			search:vls,
			customer_type:this.radioChek
		}
		this.globleServiceService.GlobalGetHitFilter(key,'customer_list').
			then(async data=>{
				if(data['customer_list'].customer_list==false){
					this.customer_details_hide=0
				}else{
					this.customer_details_hide=1
					this.customers=data['customer_list'].customer_list
				}
			})
		});
	}

	back(){
		this.router.navigateByUrl('/home');
	}
  
	customer_details(id,customer_type){
		this.router.navigateByUrl('/customer-details/' + id +'/'+ customer_type)	
		this.searchText=''
	}

	add_customer(){
		this.router.navigateByUrl('/add-customer')
		this.searchText=''
	}

	// User add cars page
	add_car(event,id,fname,lname,type){
		event.stopPropagation();
		let key={
			fname:fname,
			lname:lname,
			type:type,
			id
		}
		this.storage.set('car_add_format','only_car')
		this.storage.set('data_only_car',key)
		this.router.navigateByUrl('/add-car')
		this.searchText=''
	}

	// Account history move page
	accountHistory(event){
		event.stopPropagation();
		this.router.navigateByUrl('/account-history')
	}
	
	searchbarValue(newValue){
		this.filterActiveInactive(this.searchText)
	}
	
	async presentAlertPrompt() {
		const alert = await this.alertController.create({
		  cssClass: 'my-custom-class',
		  header: 'Customer Type',
		  inputs: [
			{
			  name: 'radio1',
			  type: 'radio',
			  label: 'Regular Customer',
			  value: '2',
			  checked: this.radioChek=='2'
			},
			{
			  name: 'radio1',
			  type: 'radio',
			  label: 'Guest Customer',
			  value: '1',
			  checked: this.radioChek=='1'
			},
			{
			  name: 'radio1',
			  type: 'radio',
			  label: 'All',
			  value: '0',
			  checked:this.radioChek=='0'
			},
		  ],
		  buttons: [
			{
			  text: 'Cancel',
			  role: 'cancel',
			  cssClass: 'secondary',
			  handler: () => {
			  }
			}, {
			  text: 'Apply',
			  handler: (vls) => {
				if(vls!=undefined && vls!='' ){
					this.radioChek=vls;
					this.customer_list()
				}else{
					this.searchText=''
					this.customer_list()
				}
			  }
			}
		  ]
		});
		await alert.present();
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
