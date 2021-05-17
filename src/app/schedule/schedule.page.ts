import { Component, OnInit } from '@angular/core';
import { CalendarComponentOptions } from 'ion2-calendar';
import { NgxSpinnerService } from 'ngx-spinner';
import { Storage } from '@ionic/storage';
import {GlobleServiceService} from '../globle-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { NotificationPage } from '../notification/notification.page';
import { ModalController } from '@ionic/angular';
import { FilterWorkerManagementPage } from '../filter-worker-management/filter-worker-management.page';
import { $ } from 'protractor';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

	user_details:any
	worker_list:any
	noti_count:any
	date= new Date();
	count=0
	data_not_found =0
	end_point=7
	start_point=7
	date_end_point
	date_start_point
	button_disable =2
	button_disable_1 =2
	filter_Data_return

	constructor(
		private spinner: NgxSpinnerService,
		private storage: Storage,
		private router: Router,
		private modalController: ModalController,
		private globleServiceService: GlobleServiceService,
	) { }

	ngOnInit() {}

	ionViewWillEnter(){
		this.userDetails()
	}

	click_time_plus(){
		this.count = this.count+1
		this.date = new Date();
		this.date.setDate(this.date.getDate() + this.count);
		var startday=document.getElementById("startday").textContent;
		if(startday=='Saturday '){
			this.button_disable_1 =1
		}else{
			this.button_disable_1 =2
			this.button_disable =2
		}
		this.getWorkerLoad()
	}

	click_time_minus(){
		this.count = this.count-1
		this.date = new Date();
		this.date.setDate(this.date.getDate() + this.count);
		var endday=document.getElementById("startday").textContent;
		if(endday=='Tuesday '){
			this.button_disable =1
		}else{
			this.button_disable =2
			this.button_disable_1 =2
		}
		this.getWorkerLoad()
	}
	
	userDetails(){
		this.storage.get('user_details').then((val) => {
			this.user_details = val;
			this.getWorkerLoad()
			this.weellCount()
		});
	}

	getWorkerLoad(){
		this.spinner.show()
		let key = {
			apikey:this.globleServiceService.apikey,
			society_id :this.user_details.society,
			user_id:this.user_details.user_id,
			date:moment(this.date).format('YYYY-MM-DD'),
		}
		this.globleServiceService.GlobalHit(key,'list_worker_load').
		then(async data=>{
			this.spinner.hide()
			if(data['worker_list'].data!=null){
				this.data_not_found =1
				this.worker_list=data['worker_list'].data[0]
			}else{
				this.data_not_found =2
			}
		})
	}

	ActiveCarPage(id,job_date,workerName,event){
		event.stopPropagation();
		this.router.navigateByUrl('/mark-task/'+ id +'/'+job_date +'/'+workerName )
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

	async filterList(){
		this.spinner.show()
		const modal = await this.modalController.create({
			component: FilterWorkerManagementPage
		})
		await modal.present();
		this.spinner.hide()
		const { data } = await modal.onWillDismiss();
		this.filter_Data_return=data
		if(this.filter_Data_return!='reset'){
			this.filteListDate(this.filter_Data_return)
		}else{
			this.getWorkerLoad()
		}
	}

	pageSchedule(type,job_id,worker_id,job_date,workerName){
		if(job_date==null){
			job_date=moment(this.date).format('YYYY-MM-DD')
		}
		if(type==1){
			this.router.navigateByUrl('/guest-schedule-management/'+ worker_id +'/'+ job_date +'/'+ workerName )
		}else{
			this.router.navigateByUrl('/schedule-management/'+ worker_id +'/'+ job_date +'/'+ workerName )
		}
	}

	filteListDate(data){
		this.spinner.show()
		let key={
			apikey:this.globleServiceService.apikey,
			user_id:this.user_details.user_id,
			society_id:this.user_details.society,
			worker_name:data.worker,
			date:moment(this.date).format('YYYY-MM-DD'),
		}
		this.globleServiceService.GlobalHit(key,'list_worker_load').
		then(data=>{
			this.spinner.hide()
			if(data['worker_list'].data[0]!=null && data['worker_list'].data!=null){
				this.data_not_found =1
				this.worker_list=data['worker_list'].data[0]
			}else{
				this.data_not_found =2
			}
		});
	}


}
