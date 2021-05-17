import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NotificationPage } from '../notification/notification.page';
import { AlertController, Platform, IonSlides, MenuController, Events } from '@ionic/angular';
import {GlobleServiceService} from '../globle-service.service'
import { Storage } from '@ionic/storage';
import { AppComponent } from '../app.component'
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    slide_banner:any;
    user_details:any;
    noti_count:any;
    login_and_logout:any;
    hide_banner=true;
	@ViewChild('slides') slides: IonSlides;
	slideOpts= {
		loop: true,
		autoplay: {
			delay: 3000
		}
    };
    
    @HostListener('document:ionBackButton', ['$event'])
	overrideHardwareBackAction(event: any) {
		this.exitApp();	
		event.detail.register(100, async () => {
			event.stopImmediatePropagation();
			event.stopPropagation();
			event.preventDefault();
		});
	}

    constructor(
		private router: Router, 
		public route: ActivatedRoute, 
		public navCtrl: NavController,
		public splashScreen: SplashScreen,
		private statusBar: StatusBar,
		private platform: Platform,
		public alertCtrl: AlertController,
		public modalController: ModalController,
        public menu:MenuController,
        private storage:Storage,
        private events:Events,
        private spinner: NgxSpinnerService,
        private globleServiceService:GlobleServiceService,
        private appComponent:AppComponent,
        public toastController: ToastController
    ){
        platform.ready().then(() => {
            this.statusBar.overlaysWebView(false);
		    this.statusBar.backgroundColorByHexString('#000000;'); 
            splashScreen.hide();
        });
       
    }

    ngOnInit(){
    }

    ionViewWillEnter(){
        this.menu.enable(true);
        this.banner()
        this.manu()
        this.weellCount()
    }

    manu(){
        this.storage.get('user_details').then((val) => {
            this.user_details = val;
            let key={
                user_id:this.user_details.user_id,
                apikey:this.globleServiceService.apikey,
            }
            this.globleServiceService.GlobalHit(key,'my_profile').
            then(data=>{
                localStorage.setItem('user_name', data['my_profile'].first_name +' '+ data['my_profile'].last_name);
                this.appComponent.userName()
        })
    })}

    exitApp(){
        if(this.router.url=='/home'){
            navigator['app'].exitApp();	
        }else{
			this.navCtrl.pop();
		}
    }

    // home page banner
    banner(){
        this.storage.get('user_details').then((val) => {
			this.user_details = val;
            let key={
                apikey:this.globleServiceService.apikey,
                user_id:this.user_details.user_id,
                access_token:this.user_details.access_token
            }
            this.globleServiceService.GlobalHit(key,'get_app_banner_list').
            then(async data=>{
                if(data['message']=="App banner List data"){
                    this.slide_banner=data['customer_list'].app_banner
                    this.hide_banner=true
                }else{
                    this.hide_banner=false;
                }
            })
        });
    }

    // Slide to refresh page
    doRefresh(event) {	
        setTimeout(() => {
            event.target.complete();
            this.banner();
        }, 2000);
    }
  
    // Notification popup open
    async presentModal(){
        const modal = await this.modalController.create({
        component: NotificationPage
        });
        await modal.present();
        const { data } = await modal.onWillDismiss();
		this.weellCount()
	}
	
    // App exit 
	exitAppPopup(){
		navigator['app'].exitApp();
	}

	// schedule management page opne
	scheduleManagement(){
		this.router.navigateByUrl('/schedule-management')	
	}
    customerManagement(){
        this.router.navigateByUrl('/customer-listing') 
    }
    workerManagement(){
        this.router.navigateByUrl('/worker-management')
    }
    ticketManagement(){
        this.router.navigateByUrl('/ticket-management')
    }
    guestScheduleManagement(){
        this.router.navigateByUrl('/guest-schedule-management')
    }
    workerload(){
        this.router.navigateByUrl('/schedule')
    }

    weellCount(){
        this.storage.get('user_details').then((val) => {
            let key={
                user_id :this.user_details.user_id,
                society :this.user_details.society,
                apikey:this.globleServiceService.apikey,
            }
            this.globleServiceService.GlobalHit(key,'notification_count ').
            then(data=>{
                this.noti_count=data['notification_count'].count_of_new_notification
            })
        })
    }

}
