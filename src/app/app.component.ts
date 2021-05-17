import { Component, HostListener } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { AlertController, MenuController, ToastController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { MarkTaskPage } from '../app/mark-task/mark-task.page';
import {GlobleServiceService} from './globle-service.service'
import * as $ from 'jquery';
import { Network } from '@ionic-native/network/ngx';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

	login_and_logout:any
	user_details:any;
	user_name: any;
	hideshow=true;

	constructor(
		private platform: Platform,
		private splashScreen: SplashScreen,
		private statusBar: StatusBar,
		public events: Events,
		private storage:Storage,
		private router: Router,
		public menu: MenuController,
		private globleServiceService:GlobleServiceService,
		public alertController:AlertController,	
		public modalController: ModalController,
		private network: Network,
		private toastController: ToastController
	) {
			this.initializeApp();
			this.user_login_chek()
			this.storage.get('user_details').then((val) => {
				this.user_details = val;
			});
	}

  	ngOnInit() {
		this.statusBar.overlaysWebView(false);
		this.statusBar.backgroundColorByHexString('#000000;'); 
		this.splashScreen.hide();
		this.statusBar.styleDefault();
	}


  // Db chek user login & logout
	user_login_chek(){
		this.events.subscribe('user_details', (data) =>{
			this.login_and_logout = data;
			this.storage.set('user_details', data);	
			if(this.login_and_logout=='' || this.login_and_logout==undefined){
				this.router.navigateByUrl('/login')
			}
			else{
				this.router.navigateByUrl('/home')
			}
		});
		this.storage.get('user_details').then((val) => {
			this.login_and_logout = val;
			if(this.login_and_logout=='' || this.login_and_logout==undefined){
				this.router.navigateByUrl('/login')
			}
			else{
				this.router.navigateByUrl('/home')
			}
		});
	}

	userName(){
		this.hideshow=false
		this.user_name = localStorage.getItem('user_name')
		this.hideshow=true
	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.overlaysWebView(false);
			this.statusBar.backgroundColorByHexString('#000000');
			this.splashScreen.hide();
			this.statusBar.styleDefault();
		});
	}

	// user logout
	async log_out(){
		const alert = await this.alertController.create({
			message: 'Do you want to logout?',
			cssClass:'custom-ios-alert',
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					cssClass: 'secondary',
				},{
					text: 'Ok',
					handler: () => {
						this.menu.enable(false);
						// -------User details remove storage-------//
						this.events.publish('user_details','');
						this.storage.set('user_details','');	
						this.storage.remove('user_details');	
						this.router.navigateByUrl('/login')
					}
				}]
			});
		await alert.present();	
	}

	// mark task open popup
	async markTask(){
		const modal = await this.modalController.create({
			component: MarkTaskPage
		});
		await modal.present();
	}

	// Change password page move
	changePassword(){
		this.router.navigateByUrl('/change-password')
	}

	profile(){
		this.router.navigateByUrl('/profile')
	}

	async alertMsg(error_msg_show){
		const toast = await this.toastController.create({
			message: error_msg_show,
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

}
