import { Component, OnInit } from '@angular/core';
import {GlobleServiceService} from '../globle-service.service'
import { Router, Navigation, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AlertController, Events, MenuController, Platform } from '@ionic/angular';
import { AppComponent } from '../app.component'
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalController } from '@ionic/angular';
import { NotificationPage } from '../notification/notification.page';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.page.html',
  styleUrls: ['./customer-details.page.scss'],
})
export class CustomerDetailsPage implements OnInit {

	customer_details_hide: 1;
	user_details: any;
	customers: any;
	society: any;
	customer_id: any;
	customer_type: any;
	car_thumbnail: any;
	user_details_name: any;
	noti_count: any;
	car_data

	constructor(
		private router : Router, 
		private routers : ActivatedRoute,
		private globleServiceService:GlobleServiceService,
		private storage:Storage,
		public alertController:AlertController,
		public events: Events,
		private appComponent:AppComponent,
		private spinner: NgxSpinnerService,
		private modalController: ModalController,
	) { 
		this.customer_id=this.routers.snapshot.params['id']
		this.customer_type=this.routers.snapshot.params['type']
		this.storage.get('user_details').then((val) => {
			this.user_details = val;
		});
	}

	ngOnInit() {
		this.storage.get('user_details').then((val) => {
			this.user_details_name = val;
			this.weellCount()
		})
	}
	
	ionViewWillEnter(){
		this.customer_view()
	}

	// customer detals data
	customer_view(){
		if(this.customer_type==2){
			this.customer_details_hide=1
			this.spinner.show()
			let key = {
				apikey:this.globleServiceService.apikey,
				customer_id: this.customer_id,
			}
			this.globleServiceService.GlobalHit(key,'get_customer_car_details ').
			then(async data=>{
				this.spinner.hide()
				this.customers=data['get_customer_car_details'].customer_data;
				this.customers = new Array(this.customers);
				this.car_thumbnail = data['get_customer_car_details'].car_data;
			})
		}else{
			this.customer_details_hide=1
			this.spinner.show()
			let key = {
				apikey:this.globleServiceService.apikey,
				customer_id: this.customer_id,
			}
			this.globleServiceService.GlobalHit(key,'get_guest_customer_car_details').
			then(async data=>{
				this.spinner.hide()
				this.customers=data['get_guest_customer_car_details'].customer_data;
				this.customers = new Array(this.customers);
				this.car_thumbnail = data['get_guest_customer_car_details'].car_data;
			})
		}
  	}

	back(){
		this.router.navigateByUrl('/customer-listing');
	}
  
	edit_customer(vls,cmt_id){
		this.router.navigateByUrl('/add-customer/'+ 'edit' +'/'+ vls +'/'+cmt_id)
	}
	
	car_view(id){
		let data={
			id:id,
			customer_type:this.customer_type,
			customer_id:this.customer_id,
		}
		this.storage.set('urlReturndata',data)
		this.router.navigateByUrl('/car-details/' + id +'/'+this.customer_type +'/'+this.customer_id)
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
