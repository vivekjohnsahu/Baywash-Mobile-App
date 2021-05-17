import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Storage } from '@ionic/storage';
import {GlobleServiceService} from '../globle-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import { ToastController } from '@ionic/angular';
import { NotificationPage } from '../notification/notification.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-mark-task',
  templateUrl: './mark-task.page.html',
  styleUrls: ['./mark-task.page.scss'],
})
export class MarkTaskPage implements OnInit {

	user_details:any;
	worker_id:any;
	job_date:any;
	active_car_list:any;
	workerName:any;
	noti_count:any;
	id=[]
	worker_id_select:any
	customer_type=[]
	array_cars=[]
	updatePopup=false
	worker_list:any
	page_hide=0
	
	constructor(
		private spinner: NgxSpinnerService,
		private storage: Storage,
		private globleServiceService: GlobleServiceService,
		private routers: ActivatedRoute,
		private router: Router,
		private modalController: ModalController,
		private toastController: ToastController,
	) {
		this.worker_id=this.routers.snapshot.params['id']
		this.job_date=this.routers.snapshot.params['job_date']
		this.workerName=this.routers.snapshot.params['workerName']
	 }

	ngOnInit() {}

	ionViewWillEnter(){
		this.userDetails()
	}
	
	userDetails(){
		this.storage.get('user_details').then((val) => {
			this.user_details = val;
			this.activeCarList()
			this.selectWorker()
			this.weellCount()
		});
	}

	activeCarList(){
		this.spinner.show()
		let key = {
			apikey:this.globleServiceService.apikey,
			worker_id:this.worker_id,
			date:this.job_date,
		}
		this.globleServiceService.GlobalHit(key,'active_cars').
		then(async data=>{
			this.spinner.hide()
			if(data['active_cars'].data!=null){
				this.page_hide = 1
				this.active_car_list=data['active_cars'].data
			}else{
				this.page_hide = 2
			}
		})
	}

	back(){
		this.page_hide = 2
		this.router.navigateByUrl('/schedule')
	}

	chek_update(id,type,worker_id,i,event,car_id){
		event.stopPropagation();
		var id_splice = id;
		if($("#checkbox_"+id).is(':checked') == true){
			this.array_cars.push({
				customer_type:type,
				id:id,
				car_id:car_id
			})
		}else{
			var a=id_splice.indexOf(id_splice)
			this.array_cars.splice(a, 1)
		}
	}

	selectWorker(){
		let key={
			apikey:this.globleServiceService.apikey,
			society_id:this.user_details.society,
			supervisor_id:this.user_details.user_id,
		}
		this.globleServiceService.GlobalHit(key,'get_worker_list_for_car').
		then(data=>{
			this.worker_list=data['get_worker_list_for_car'];
		});
	}

	selectNewWorker(vls){
		this.worker_id_select=vls
	}

	updateWorker(){
		if(this.array_cars.length>0){
			this.updatePopup=true
		}else{
			this.alertMsg('Please select atleast one record')
		}
	}

	openModelHide(){
		this.updatePopup=false
	}

	submit(){
		if(this.worker_id_select!=undefined){
			this.spinner.show()
			let key = {
				apikey:this.globleServiceService.apikey,
				all_info:this.array_cars,
				worker_id:this.worker_id_select
			}
			this.globleServiceService.GlobalHit(key,'update_worker_from_worker_management').
			then(async data=>{
				this.spinner.hide()
				if(data['responseCode']==200){
					this.activeCarList()
					this.alertMsgsuccess('Worker updated successfully')
					this.updatePopup=false
					this.id=[]
					this.worker_id_select=undefined
					this.array_cars=[]
					this.customer_type=[]
				}else{
					this.alertMsg(data['message'])	
				}
			})
		}else{
			this.alertMsg('Please select worker')
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
