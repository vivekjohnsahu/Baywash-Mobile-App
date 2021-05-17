import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import {GlobleServiceService} from '../globle-service.service'
import { Storage } from '@ionic/storage';
import { AppComponent } from '../app.component'
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as $ from 'jquery';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

	user_email:any
	changePassword: FormGroup;
	errorHideShow=false
	change_pw = {
		new_password:"",
		comf_password:"",
	};
	
	constructor(
		public alertController: AlertController,
		public toastController:ToastController,
		public spinner:NgxSpinnerService,
		private globleServiceService:GlobleServiceService,
		private storage:Storage,
		private appComponent:AppComponent,
		private router:Router,
		private statusBar: StatusBar,
	) 
	{
		 //  validation pattern start
		this.changePassword = new FormGroup({
			new_password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
			comf_password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)])
		});
	 }
 
	 ngOnInit() {
		 this.statusBar.overlaysWebView(false);
		 this.statusBar.backgroundColorByHexString('#000000'); 

		 $(function() {
			var txt = $("ion-input#pass1");
			var func = function() {
				txt.val(txt.val().replace(/\s/g, ''));
			}
			txt.keyup(func).blur(func);
		});
		$(function() {
			var txt = $("ion-input#pass2");
			var func = function() {
				txt.val(txt.val().replace(/\s/g, ''));
			}
			txt.keyup(func).blur(func);
		});

	 }

	changePass(){
		this.spinner.show()   
		this.storage.get('user_email').then(async (val) => {
		this.user_email = val;
			if (this.change_pw.new_password !=  this.change_pw.comf_password){
				this.spinner.hide()
				this.errorHideShow=true
			}else if(this.change_pw.new_password && this.change_pw.comf_password){
				let key = {
					email:this.user_email,
					apikey:this.globleServiceService.apikey,
					new_password:this.change_pw.new_password,
					confirm_password:this.change_pw.new_password,
				}
				this.globleServiceService.GlobalHit(key,'changePassword')
				.then(async data => {
					this.spinner.hide()
					if(data['responseCode']=='200'){
						const toast = await this.toastController.create({
							message: data['message'],
							position:'bottom',
							color:"success",
							duration: 3000
						});
						toast.present();
						this.changePassword.reset()
						this.router.navigateByUrl('/login');
					}else{
						const toast = await this.toastController.create({
							message: data['message'],
							position:'bottom',
							color:"danger",
							duration: 3000
						});
						toast.present();
					}
				})
			}
		})
	}

	clickInput(){
		this.errorHideShow=false
	}
	
	forgotPasswordPage(){
		this.router.navigateByUrl('/forgot-password')
		this.changePassword.reset()
	}

}
