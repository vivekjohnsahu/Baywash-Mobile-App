import { Component, OnInit } from '@angular/core';
import { ToastController,AlertController, MenuController, IonSlides, Platform,Events } from '@ionic/angular';
import { Router, Navigation } from '@angular/router';
declare var SMSReceive: any;
import { Storage } from '@ionic/storage';
import { NgxSpinnerService } from 'ngx-spinner';
import {GlobleServiceService} from '../globle-service.service'
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit {

	get_otp:any;
	email:any;
	OTP: string = '';
	OTPmessage: string;
	private _status: any;
	message: any;

	constructor(
		public router:Router,
		public alertController:AlertController,
		public toastController: ToastController,
		public storage: Storage,
		public globleServiceService: GlobleServiceService,
		private spinner: NgxSpinnerService,
		private statusBar: StatusBar,

	) { }

	ngOnInit() {
		this.statusBar.overlaysWebView(false);
		this.statusBar.backgroundColorByHexString('#000000'); 
	}

	ionViewWillEnter() {
		this.storage.get('user_email').then((val) => {
			this.email = val;
		})
		this.start()
	}

	async otp_submit(){
		if(this.get_otp == " " || this.get_otp == undefined ){
			const alert = await this.alertController.create({
				message: 'Please enter OTP',
				buttons: ['OK']
			});
			await alert.present();
		}else if(this.get_otp.length < 4){
			const alert = await this.alertController.create({
				message: 'Enter 4 digit OTP number',
				buttons: ['OK']
			});
			await alert.present();
		}else{
			this.otp_verify(this.get_otp)
		}
	}

	resend_otp(){
		let key={
			email:this.email,
			apikey:this.globleServiceService.apikey,
			user_type:'1'
		}
		this.globleServiceService.GlobalHit(key,'forget_password').
		then(async data=>{
			this.spinner.hide()
			const toast = await this.toastController.create({
				message: data['status'].message,
				duration: 3000,
				position: 'bottom',
				color:'success'
			});
			toast.present();
		})
	}

	start() {
		SMSReceive.startWatch(
		  () => {
			document.addEventListener('onSMSArrive', (e: any) => {
			  var IncomingSMS = e.data;
			  this.processSMS(IncomingSMS);
			});
		  },
		  () => { console.log('watch start failed') }
		)
	}
	
	async processSMS(data) {
		const message = data.body;
		if (message && message.indexOf('enappd_starters') != -1) {
		  this.OTP = data.body.slice(0, 4);
		  this.OTPmessage = 'OTP received. Proceed to register'
		  const toast = await this.toastController.create({
			message:this.OTP,
			duration: 8000
		  });
		  toast.present();
		  this.stop();
		}
	}

	stop() {
		SMSReceive.stopWatch()
	}

	forgotPasswordPage(){
		this.router.navigateByUrl('/forgot-password');
		this.get_otp=''
	}
	
	otp_verify(otp){
		let key={
			email:this.email,	
			user_type:'1',
			otp:otp,
			apikey:this.globleServiceService.apikey,
		}
		this.globleServiceService.GlobalHit(key,'otp_verify').
		then(async data=>{
			this._status = data['responseCode']
			this.message = data['message']
			this.spinner.hide()
			if(this._status=='200'){
				const toast = await this.toastController.create({
					message: this.message,
					duration: 3000,
					position: 'bottom',
					color:'success'
				});
				toast.present();
				this.get_otp=''
				this.router.navigateByUrl('/change-password');
			}else{
				const toast = await this.toastController.create({
					message: this.message,
					duration: 3000,
					position: 'bottom',
					color:'danger'
				});
				toast.present();
			}
		})
	}

}
