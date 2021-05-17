import { Component, OnInit, ViewChild,HostListener } from '@angular/core';
import { Router, Navigation } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuController, IonSlides, AlertController, Platform,NavController,ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { Events } from '@ionic/angular';
import {GlobleServiceService} from '../globle-service.service'
import { NgxSpinnerService } from 'ngx-spinner';
import * as $ from 'jquery';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    public _status:any;
	user_login:any
	society_list:any
	signupform: FormGroup;
	message: any;
	society: any;
	login_and_logout: any;
	email_msg_hide=false
	password_msg_hide=false
	society_msg_hide=false
	chekSubmit=0
	LoginData = {
		email:"",
		password:"",
		Society:"",
	};

	@HostListener('document:ionBackButton', ['$event'])
	overrideHardwareBackAction(event: any) {
		this.exitApp()
		event.detail.register(100, async () => {
			event.stopImmediatePropagation();
			event.stopPropagation();
			event.preventDefault();
		});
	}

	constructor(
		private router : Router, 
		public menu: MenuController,
		private splashScreen: SplashScreen,
		private statusBar: StatusBar,
		private platform: Platform,
		private storage: Storage,
		public events: Events,
		public globleServiceService: GlobleServiceService,
		private spinner: NgxSpinnerService,
		public alertController: AlertController,
		private navCtrl: NavController,
		public toastController:ToastController,
	){ 

	//  validation pattern
		let email_pattern = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
		this.signupform = new FormGroup({
			email: new FormControl('', [Validators.required, Validators.pattern(email_pattern)]),            
			password: new FormControl('', [Validators.required, Validators.minLength(1)]),
			Society: new FormControl('', [Validators.required])
		});

		platform.ready().then(() => {
			statusBar.styleDefault();
			splashScreen.hide();
		});

	}

	ngOnInit(){
		this.statusBar.overlaysWebView(false);
		this.statusBar.backgroundColorByHexString('#000000'); 
		$(function() {
			var txt = $("input#UserName");
			var func = function() {
				txt.val(txt.val().replace(/\s/g, ''));
			}
			txt.keyup(func).blur(func);
		});
		$(function() {
			var txt = $("input#passs");
			var func = function() {
				txt.val(txt.val().replace(/\s/g, ''));
			}
			txt.keyup(func).blur(func);
		});

	}

	Capitalizelowercase(event){
		this.LoginData.email=this.LoginData.email.trim()
		if(event==''){
			$(".addcls1").removeClass("input123");
		}else{
			$(".addcls1").addClass("input123");
		}
	}
	
	Capitalizelowercase1(event){
		if(event==''){
			$(".addcls2").removeClass("input123");
		}else{
			$(".addcls2").addClass("input123");
		}
	}

  	// manu bar hide
	ionViewWillEnter() {
		this.menu.enable(false);
		this.societyList()
	}

	exitApp(){
		if(this.router.url=='/login'){
			navigator['app'].exitApp();	
		}else{
			this.navCtrl.pop();
		}
	}

	user(){
		this.LoginData.email=this.LoginData.email.trim()
		console.log(this.LoginData.email.split(' '))
	}

  	// login user
	async login(){
		if(this.chekSubmit==1){
			this.spinner.show();
		let loginData={
			'apikey' : this.globleServiceService.apikey,
			'email':this.LoginData.email,
			'password':this.LoginData.password,
			'society':this.LoginData.Society,
			'user_type':'1'
		}
		this.globleServiceService.GlobalHit(loginData,'loginauth')
		.then(async data => {
			this._status = data['status'].responseCode
			this.message = data['status'].message
			this.spinner.hide();
			if(this._status=='200'){	
				// -------User details set storage-------//
				this.storage.set('user_details', data['data']);
				this.events.publish('user_details', data['data'])
				this.router.navigateByUrl('/home')
				$(".addcls1").removeClass("input123");
				$(".addcls2").removeClass("input123");
				this.signupform.reset();
			}else if(this._status=='401'){
                this.email_msg_hide=true
			}else if(this._status=='204'){
				if(this.message=='Failed to authenticate, Password was invalid!'){
					this.password_msg_hide=true
				}else{
					this.society_msg_hide=true
				}
			}
		}); 
		}
	}

	clickSociety(){
		this.society_msg_hide=false
	}

	societyList(){
		this.globleServiceService.GlobalHit({'apikey' : this.globleServiceService.apikey},'get_society')
		.then(data => {
			this.society_list = data['society_list'].socity
		})
	}

	society_select(vls,name){
		this.chekSubmit=1
		// this.society=vls
		this.LoginData.Society=vls
		this.society_msg_hide=false
	}

	forgotPasswordPage(){
		this.signupform.reset();
		this.router.navigateByUrl('/forgot-password')
	}

	clickEmail(){
		this.email_msg_hide=false
	}
	
	clickPass(){
		this.password_msg_hide=false
	}
	
}
