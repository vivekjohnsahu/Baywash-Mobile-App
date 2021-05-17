import { Component, OnInit, HostListener } from '@angular/core';
import { Router, Navigation, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Events, ToastController, AlertController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import {GlobleServiceService} from '../globle-service.service'
import {AddCarPage} from '../add-car/add-car.page'
import { ModalController } from '@ionic/angular';
import { NotificationPage } from '../notification/notification.page';

@Component({
  selector: 'app-discount-calculator',
  templateUrl: './discount-calculator.page.html',
  styleUrls: ['./discount-calculator.page.scss'],
  providers:[AddCarPage]
})
export class DiscountCalculatorPage implements OnInit {

	user_details_name: any;
	noti_count: any;
	user: any;
	service: any;
	monthly_service: any;
	weekly_service: any;
	car_type: any;
	total_package_amount: any;
	service_amount: any;
	cmt_id: any;
	discount=0;
	service_amount_error=false;
	type
	recently_added_car_id = [] as  any;
	previous_package_amount
	previous_discount
	input_amount

	@HostListener('document:ionBackButton', ['$event'])
	overrideHardwareBackAction(event: any) {
		// this.router.navigateByUrl('/customer-listing')
		event.detail.register(100, async () => {
			event.stopImmediatePropagation();
			event.stopPropagation();
			event.preventDefault();
		});
	}

	constructor(
		private globleServiceService:GlobleServiceService,
		private storage:Storage,
		public events: Events,
		public toastController: ToastController,
		private spinner: NgxSpinnerService,
		private router : Router, 
		private routers : ActivatedRoute,
		private alertController : AlertController,
		private addCarPage : AddCarPage,
		private modalController : ModalController,
	){
		this.user=this.routers.snapshot.params['user']
		this.service=this.routers.snapshot.params['service']
		this.monthly_service=this.routers.snapshot.params['monthly_service']
		this.weekly_service=this.routers.snapshot.params['weekly_service']
		this.car_type=this.routers.snapshot.params['car_type']
		this.cmt_id=this.routers.snapshot.params['cmt_id']
	}

	ngOnInit() {
		this.storage.get('user_details').then((val) => {
			this.user_details_name = val;
			this.discountCalculator()
			this.weellCount()
		})	
	}
	
	previousDiscount(){
		let key={
			apikey:this.globleServiceService.apikey, 
			customer_id:this.cmt_id,
			car_id:this.globleServiceService.is_arry
		}
		this.spinner.show()
		this.globleServiceService.GlobalHit(key,'discount_calculator_only_cars').
		then(async data=>{
			this.spinner.hide()
			this.total_package_amount=data['total_package_amount'].total_package_amount
			this.previous_package_amount=data['total_package_amount'].previous_package_amount
			this.previous_discount=data['total_package_amount'].discount
			this.input_amount=data['total_package_amount'].input_amount
		})
	}

	discountCalculator(){
		if(this.user=='add_guest_customer' || this.user=='only_add_guest_customer_car'){
			this.type=1
			this.only_add_guest_customer_car()
		}else{
			this.type=2
			this.previousDiscount()
		}
	}

	serviceAmountChek(){
		setTimeout(() => {
			if(parseFloat(this.service_amount)>parseFloat(this.total_package_amount)){
				this.service_amount_error=true;
				this.discount=0
			}else{
				this.service_amount_error=false;
				this.discount=this.total_package_amount-this.service_amount
			}
		}, 500);
	}

	submit(){
		if(this.service_amount==undefined || this.service_amount==''){
			this.alertMsg('Service Amount cannot be blank.')
		}else if(this.service_amount_error==true){
			this.alertMsg('Service amount cannot be greater than Package Amount.')
		}else{
			this.spinner.show()
			let key={
				discount:this.discount + parseInt(this.previous_discount),
				customer_id:this.cmt_id,
				input_amount:this.service_amount,
				previous_amount:this.input_amount,
				apikey:this.globleServiceService.apikey,
			}
			this.globleServiceService.GlobalHit(key,'discount_update').
			then(async data=>{
				this.spinner.hide()
				this.alertMsgsuccess('Car add successfully')
				this.cancelCarAdd()
				this.router.navigateByUrl('/customer-listing')
				this.globleServiceService.is_arry=[]
				this.storage.remove('more_car_data')
			})	
		}
	}

	back_to_page(){
		let key={
			apikey:this.globleServiceService.apikey, 
			customer_type:this.type, 
			car_id:this.globleServiceService.is_arry, 
			customer_id:this.cmt_id, 
		}
		this.globleServiceService.GlobalHit(key,'delete_previous_car').then(async data=>{
			this.globleServiceService.is_arry=[]
			this.router.navigateByUrl('/customer-listing')
		})
	}

	cancelCarAdd(){
		if(this.user=='add_guest_customer' || this.user=='only_add_guest_customer_car'){
			if(this.user=='only_add_guest_customer_car' && this.globleServiceService.chek_page_customer=='false'){
				let key={
					apikey:this.globleServiceService.apikey, 
					customer_id:this.cmt_id,
					total_package_amount:this.total_package_amount,
					payable_amount :this.service_amount,
					discount:this.total_package_amount-this.service_amount,
					car_id:this.globleServiceService.is_arry
				}
				this.globleServiceService.GlobalHit(key,'send_guest_car_mail').then(async data=>{})
			}else{
				let key={
					apikey:this.globleServiceService.apikey,
					customer_id:this.cmt_id,
					total_package_amount:this.total_package_amount,
					payable_amount :this.service_amount,
					discount:this.total_package_amount-this.service_amount,
					car_id:this.globleServiceService.is_arry
				}
				this.globleServiceService.GlobalHit(key,'send_guest_mail').then(async data=>{})
			}
		}else{
			if(this.user=='only_add_customer_car' && this.globleServiceService.chek_page_customer=='false'){
				let key={
					apikey:this.globleServiceService.apikey,
					customer_id:this.cmt_id,
					total_package_amount:this.total_package_amount,
					payable_amount :this.service_amount,
					discount:this.total_package_amount-this.service_amount,
					car_id:this.globleServiceService.is_arry
				}
				this.globleServiceService.GlobalHit(key,'send_reg_car_mail').then(async data=>{})
			}else{
				let key={
					apikey:this.globleServiceService.apikey,
					customer_id:this.cmt_id,
					total_package_amount:this.total_package_amount,
					payable_amount :this.service_amount,
					discount:this.total_package_amount-this.service_amount,
					car_id:this.globleServiceService.is_arry
				}
				this.globleServiceService.GlobalHit(key,'send_regular_mail').then(async data=>{})
			}
		}
	}

	async alertMsg(msg){
		const toast = await this.toastController.create({
			message: msg,
			color: 'danger',
			position:'bottom',
			duration: 2000,
		});
		toast.present();
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

	only_add_guest_customer_car(){
		let key={
			apikey:this.globleServiceService.apikey, 
			customer_id:this.cmt_id,
			car_id:this.globleServiceService.is_arry
		}
		this.globleServiceService.GlobalHit(key,'discount_calculator_guest').
		then(async data=>{
			this.spinner.hide()
			this.total_package_amount=data['total_package_amount'].total_package_amount
			this.previous_package_amount=data['total_package_amount'].previous_package_amount
			this.previous_discount=data['total_package_amount'].discount
			this.input_amount=data['total_package_amount'].input_amount
		})
	}

	weellCount(){
		let key={
			user_id :this.user_details_name.user_id,
			society :this.user_details_name.society,
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
