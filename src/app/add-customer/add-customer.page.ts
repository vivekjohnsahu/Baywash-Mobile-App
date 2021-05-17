import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute, Navigation } from '@angular/router';
import { ToastController, NavController,AlertController,ActionSheetController, MenuController, IonSlides, Platform  } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NgxSpinnerService } from 'ngx-spinner';
import { Storage } from '@ionic/storage';
import { AppComponent } from '../app.component'
import {GlobleServiceService} from '../globle-service.service';
import * as $ from 'jquery';
import { ModalController } from '@ionic/angular';
import { NotificationPage } from '../notification/notification.page';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.page.html',
  styleUrls: ['./add-customer.page.scss'],
})
export class AddCustomerPage implements OnInit {

	public _status:any;
	ImageBind_dataBase='';
	practiceOpt:any;
	noti_count:any;
	Message: any;
	checked_billing = 0;
	societies: any;
	billing_address_error=false
	billing_address: any;
	user_details:any;
	edit
	type
	cmt_id
	star_phone_no:any;
	type_change=1
	chekAddress=0
	signupUser: FormGroup;

	userData = {
		apikey:"",
		society:"",	
		first_name:"",
		last_name:"",
		email:"",
		phone_no:"",
		flat:"",
		tower:"",
		address:"",
		billing_address:"",
	};

  constructor(
    	private router : Router, 
		private actionSheetController:ActionSheetController,
		public alertController: AlertController,
		public menu: MenuController,
		private splashScreen: SplashScreen,
		public globleServiceService:GlobleServiceService,
		private statusBar: StatusBar,
		private spinner: NgxSpinnerService,
		private storage: Storage,
		private zone: NgZone,
		private appComponent: AppComponent,
		public toastController:ToastController,
		private routers : ActivatedRoute,
		private modalController:ModalController,
  ) {

		//  validation pattern start
		let email_pattern = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
		this.signupUser = new FormGroup({
			society: new FormControl('', [Validators.required]),
			first_name: new FormControl('', [Validators.required]),       
			last_name: new FormControl('', [Validators.required]),       
			email: new FormControl('', [Validators.required, Validators.pattern(email_pattern)]),            
			phone_no: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
			billing_address: new FormControl(),   
			flat: new FormControl('', [Validators.required]), 
			tower: new FormControl('', [Validators.required]), 
			address: new FormControl('', [Validators.required]),
		});

		this.edit=this.routers.snapshot.params['edit']
		this.cmt_id=this.routers.snapshot.params['cmt_id']
		this.type=this.routers.snapshot.params['type']
		if(this.type==undefined || this.type==null || this.type==''){
			this.type=2
		}
		if(this.edit!='undefined' || this.edit!=undefined){
			this.editValueFillFnc()
		}
	}

	ngOnInit(){
		$(function() {
			var txt = $("ion-input#UserNameemail");
			var func = function() {
				txt.val(txt.val().replace(/\s/g, ''));
			}
			txt.keyup(func).blur(func);
		});
	}

	back(){
		this.router.navigateByUrl('/customer-listing');
		this.signupUser.reset()
	}
	
	ionViewWillEnter(){
		this.storage.set('car_add_format','with_user_regular')
		this.storage.remove('data_only_car')
		this.society_list()  
	}

	change(vls){
		this.type_change=vls
		if(vls==1){
			this.storage.set('car_add_format','with_user_regular')

		}else if(vls==2){
			this.storage.set('car_add_format','with_user_guest')
		}
	}

	changed(){
		if($('.pepperoni_').prop('checked')==true){
			this.userData.billing_address=''
			this.checked_billing = 0;
			this.billing_address_error =false
		}
		else{
			this.userData.billing_address=this.userData.address
			this.checked_billing = 1;
			this.billing_address_error =false
		}
	}

	society_list(){
		this.storage.get('user_details').then((val) => {
			this.user_details = val;
			this.userData.society=val.society_name
			this.weellCount()
		});
	}

	async addCustomer(){
		if(this.checked_billing != 1){
			if(this.userData.billing_address == undefined || this.userData.billing_address == ''){
				this.billing_address_error =true
			}else{
				this.billing_address_error =false
				this.formSubmit()
			}
		}else{
			this.billing_address_error =false
			this.formSubmit()
		}
	}

	error_hide_billing(){
		this.billing_address_error =false
	}
	
	async formSubmit(){
		if(this.edit==undefined || this.edit=='undefined'){
			if(this.userData.billing_address==this.userData.address && this.checked_billing == 0){
				const toast = await this.toastController.create({
					message: 'Permanent address and billing address must be different',
					color: 'danger',
					position:'bottom',
					duration: 2000,
				});
				toast.present();
			}else{
				this.spinner.show()
				if(this.userData.billing_address==''){
					this.userData.billing_address=this.userData.address
					this.chekAddress=1
				}
				this.storage.get('user_details').then((val) => {
					this.user_details = val;
					let key={
						apikey:this.globleServiceService.apikey,
						customer_type: this.type_change,
						society: this.user_details.society,
						first_name: this.userData.first_name,
						last_name: this.userData.last_name,
						email: this.userData.email,
						phone_no:this.userData.phone_no,
						flat: this.userData.flat,
						tower: this.userData.tower,
						address:this.userData.address,
						billing_address:this.userData.billing_address,
						supervisor_block:this.user_details.user_id,
						access_token:this.user_details.access_token,
						user_id:this.user_details.user_id,
					}
					let email_phone ={
						email:this.userData.email,
						phone:this.userData.phone_no,
						apikey:this.globleServiceService.apikey,
					}
					this.globleServiceService.GlobalHit(email_phone,'check_email_phone').
					then(async data=>{
						this.spinner.hide()
						if(this.chekAddress==1){
							this.userData.billing_address=''
						}
						if(data['responseCode']==200){
							this.storage.set('customer_data',key)
							this.router.navigateByUrl('/add-car');
							this.globleServiceService.chekPageCustomer('true')
						}else{
							const toast = await this.toastController.create({
								message: data['message'],
								color: 'danger',
								position:'bottom',
								duration: 2000,
							});
							toast.present();
						}
					})
				});
			}
		}else{
			this.spinner.show()
			if(this.userData.billing_address==''){
				this.userData.billing_address=this.userData.address
				this.chekAddress=1
			}
			this.storage.get('user_details').then((val) => {
				this.user_details = val;
				let key={
					apikey:this.globleServiceService.apikey,
					customer_type: this.type_change,
					society: this.user_details.society,
					first_name: this.userData.first_name,
					last_name: this.userData.last_name,
					email: this.userData.email,
					phone_no:this.userData.phone_no,
					flat: this.userData.flat,
					tower: this.userData.tower,
					address:this.userData.address,
					billing_address:this.userData.billing_address,
					supervisor_block:this.user_details.user_id,
					customer_id:this.cmt_id,
					user_id:this.user_details.user_id,
				}
				this.globleServiceService.GlobalHit(key,'edit_customer').
				then(async data=>{
					this.spinner.hide()
					if(this.chekAddress==1){
						this.userData.billing_address=''
					}
					if(data['responseCode']==200){
						const toast = await this.toastController.create({
							message: data['message'],
							color: 'success',
							position:'bottom',
							duration: 2000,
						});
						toast.present();
						this.router.navigateByUrl('/customer-details/' + this.cmt_id +'/'+ this.type)
						this.signupUser.reset()
					}else{
						const toast = await this.toastController.create({
							message: data['status'].message,
							color: 'danger',
							position:'bottom',
							duration: 2000,
						});
						toast.present();
					}
				})
			});
		}
	}
//  signUp function end

	numberAccept(event): boolean {
		const charCode = (event.which) ? event.which : event.keyCode;
		if(charCode > 31 && (charCode < 48 || charCode > 57)) {
			return false;
		}
		return true;
	}

	editValueFillFnc(){
		this.spinner.show()
		if(this.type==2){
			let key = {
				apikey:this.globleServiceService.apikey,
				customer_id: this.cmt_id,
			}
			this.globleServiceService.GlobalHit(key,'get_customer_car_details ').
			then(async data=>{
				this.spinner.hide()
				this.userData.first_name=data['get_customer_car_details'].customer_data.first_name
				this.userData.last_name=data['get_customer_car_details'].customer_data.last_name
				this.userData.email=data['get_customer_car_details'].customer_data.email
				this.userData.phone_no=data['get_customer_car_details'].customer_data.mobile
				this.star_phone_no=data['get_customer_car_details'].customer_data.mobile.slice(0, 7);
				this.star_phone_no =  this.star_phone_no + '***'
				this.userData.flat=data['get_customer_car_details'].customer_data.flat
				this.userData.tower=data['get_customer_car_details'].customer_data.tower
				this.userData.address=data['get_customer_car_details'].customer_data.address
				this.userData.billing_address=data['get_customer_car_details'].customer_data.billing_address
			})
		}else{
			let key = {
				apikey:this.globleServiceService.apikey,
				customer_id: this.cmt_id,
			}
			this.globleServiceService.GlobalHit(key,'get_guest_customer_car_details').
			then(async data=>{
				this.spinner.hide()
				this.userData.first_name=data['get_guest_customer_car_details'].customer_data.first_name
				this.userData.last_name=data['get_guest_customer_car_details'].customer_data.last_name
				this.userData.email=data['get_guest_customer_car_details'].customer_data.email
				this.userData.phone_no=data['get_guest_customer_car_details'].customer_data.mobile
				this.star_phone_no=data['get_guest_customer_car_details'].customer_data.mobile.slice(0, 7);
				this.star_phone_no =  this.star_phone_no + '***'
				this.userData.flat=data['get_guest_customer_car_details'].customer_data.flat
				this.userData.tower=data['get_guest_customer_car_details'].customer_data.tower
				this.userData.address=data['get_guest_customer_car_details'].customer_data.address
				this.userData.billing_address=data['get_guest_customer_car_details'].customer_data.billing_address
			})
		}
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
