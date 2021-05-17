import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute, Navigation } from '@angular/router';
import { ToastController, NavController,AlertController,ActionSheetController, MenuController, IonSlides, Platform  } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NgxSpinnerService } from 'ngx-spinner';
import { Storage } from '@ionic/storage';
import {GlobleServiceService} from '../globle-service.service';
import * as moment from 'moment';
import { ModalController } from '@ionic/angular';
import { NotificationPage } from '../notification/notification.page';

@Component({
  selector: 'app-reassign',
  templateUrl: './reassign.page.html',
  styleUrls: ['./reassign.page.scss'],
})
export class ReassignPage implements OnInit {

	userData:any
	user_details:any
	id:any
	date:any
	scheduleList:any
	noti_count:any
	worker_list:any
	reassign: FormGroup;
	workerData = {
		apikey:"",
		customer:"",
		service:"",
		minute:"",
		jon_date:"",
		car_details:"",
		reassign_worker:"",
		reAssignation:"",
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
			public toastController:ToastController,
			private routers : ActivatedRoute,
			private modalController : ModalController,
			private navCtrl: NavController, 
	) {
    this.reassign = new FormGroup({
		customer: new FormControl(),
		service: new FormControl(),
		minute: new FormControl(),
		jon_date: new FormControl(),
		car_details: new FormControl(),
		reassign_worker: new FormControl(),
		reAssignation: new FormControl(),
    });
		this.date=this.routers.snapshot.params['date']
		this.id=this.routers.snapshot.params['id']
	}

	ngOnInit() {
		this.society_list()
		this.scheduleData()
	}

	society_list(){
		this.storage.get('user_details').then((val) => {
			this.user_details = val;
			this.weellCount()
		});
	}
  
	scheduleData(){
		this.spinner.show()
		let key={
			apikey:this.globleServiceService.apikey,
			id:this.id,
			jobdate:moment(this.date).format('YYYY-MM-DD'),
		}
		this.globleServiceService.GlobalHit(key,'work_allocation').
		then(data=>{
			this.spinner.hide()
			this.worker_list=data['work_allocation'].worker_list
			this.workerData.customer=data['work_allocation'].data_list[0].customer_name
			this.workerData.service=data['work_allocation'].data_list[0].service_name
			this.workerData.minute=data['work_allocation'].data_list[0].total_job_hours
			this.workerData.reassign_worker=data['work_allocation'].data_list[0].worker_id
			this.workerData.jon_date=data['work_allocation'].data_list[0].jobDate
			this.workerData.car_details=data['work_allocation'].data_list[0].company_name +' '+ data['work_allocation'].data_list[0].model +' '+ data['work_allocation'].data_list[0].registration_no		
			if(data['work_allocation'].data_list[0].reassign_reason=='0'){
				this.workerData.reAssignation='2'
			}else{
				this.workerData.reAssignation=data['work_allocation'].data_list[0].reassign_reason
			}
		});
	}

	backPage(){
		this.router.navigateByUrl('/schedule-management')
	}

	changeReAssignation(vls){
		this.workerData.reAssignation=vls
	}

	reassignWorker(){
		var localValue
		if(this.workerData.reassign_worker=='0' || this.workerData.reassign_worker==null || this.workerData.reassign_worker==undefined){
			this.alertMsg('Please select worker')
		}else{
			this.spinner.show()
			let key={
				apikey:this.globleServiceService.apikey,
				worker_id:this.workerData.reassign_worker,
				reassign_reason:this.workerData.reAssignation,
				id:this.id,
			}
			this.globleServiceService.GlobalHit(key,'reassign_worker').
			then(data=>{
				this.spinner.hide()
				if(data['responseCode']=='200'){
					this.alertMsgsuccess(data['message'])
					this.storage.get('valueObj').then((val) => {
						localValue=val
						this.storage.get('filter_value').then((val) => {
							if(localValue==undefined || localValue==null || localValue=='' || val.chek_date==1){
								console.log('88888888888')
								this.router.navigateByUrl('/schedule-management')
								this.storage.remove('valueObj')
							}else{
								console.log('9999999999')
								this.router.navigateByUrl('/schedule-management/'+ localValue.workerId +'/'+ localValue.job_date +'/'+ localValue.workerName )
								this.storage.remove('valueObj')
							}
						})
						
					});
				}else{
					this.alertMsg(data['message'])
				}
			})
		}
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
