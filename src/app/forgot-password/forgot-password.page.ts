import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {GlobleServiceService} from '../globle-service.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Router, Navigation } from '@angular/router';
import { Storage } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as $ from 'jquery';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  	signupform: FormGroup;
	_status: any;
	message: any;
	forgot = {
		email:''
	}
  
	constructor(
		public globleServiceService: GlobleServiceService,
		private spinner: NgxSpinnerService,
		public alertController: AlertController,
		public toastController: ToastController,
		private router : Router, 
		private storage : Storage, 
		private statusBar: StatusBar,
	) { 
		//  validation pattern start
		let email_pattern = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
		this.signupform = new FormGroup({
			email: new FormControl('', [Validators.required, Validators.pattern(email_pattern)]),            
		});
	}

	ngOnInit() {
		this.statusBar.overlaysWebView(false);
		this.statusBar.backgroundColorByHexString('#000000;'); 

		$(function() {
			var txt = $("input#emailUse");
			var func = function() {
				txt.val(txt.val().replace(/\s/g, ''));
			}
			txt.keyup(func).blur(func);
		});
	}


	ionViewWillEnter(){}
	
	// password forgot
	forgot_pass(){
		this.spinner.show()
		let key={
			email:this.forgot.email,
			apikey:this.globleServiceService.apikey,
			user_type:'1'
		}
		this.globleServiceService.GlobalHit(key,'forget_password').
		then(async data=>{
			this._status = data['status'].responseCode
			this.message = data['status'].message
			this.spinner.hide()
			if(this._status=='200'){
				const toast = await this.toastController.create({
					message: this.message,
					duration: 3000,
					position: 'bottom',
					color:'success'
				});
				toast.present();
				this.storage.set('user_email', this.forgot.email);
				this.router.navigateByUrl('/otp')
				this.signupform.reset()
			}else{
				const toast = await this.toastController.create({
					message: this.message,
					duration: 4000,
					position: 'bottom',
					color:'danger'
				});
				toast.present();
			}
		})
	}

	loginPage(){
		this.router.navigateByUrl('/login')
		this.signupform.reset()
	}

}
