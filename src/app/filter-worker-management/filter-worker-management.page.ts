import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute, Navigation } from '@angular/router';
import { ToastController, NavController,AlertController,ActionSheetController, MenuController, Platform  } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { Storage } from '@ionic/storage';
import {GlobleServiceService} from '../globle-service.service';
import { ModalController } from '@ionic/angular';
import * as $ from 'jquery';

@Component({
  selector: 'app-filter-worker-management',
  templateUrl: './filter-worker-management.page.html',
  styleUrls: ['./filter-worker-management.page.scss'],
})
export class FilterWorkerManagementPage implements OnInit {

  	user_details:any;
	society:any;
	customers_listing:any;
	setCustomer:any;
	worker_list:any;
	retain_filter_value:any;
	worker='';
	form_date=null;
	to_date=null;

	constructor(
		private router : Router, 
		public alertController: AlertController,
		public menu: MenuController,
		public globleServiceService:GlobleServiceService,
		private storage: Storage,
		public toastController:ToastController,
		private routers : ActivatedRoute,
		private modalController : ModalController,
	) {}
	
	ionViewWillEnter(){
		this.storage.get('filter_value').then((val) => {
			this.retain_filter_value = val
			if(this.retain_filter_value!=null){
				this.worker=this.retain_filter_value.worker
				this.society_list()
			}else{
				this.society_list()
			}
		})
	}

	ngOnInit() {}

	society_list(){
		this.storage.get('user_details').then((val) => {
			this.user_details = val;
		});
	}


	dismiss(){
		this.modalController.dismiss('reset');
		this.storage.remove('filter_value')
	}

	filterData(){
		if(this.worker=='' || this.worker==null || this.worker==undefined){
			this.alertMsg('Please select atleast one filter')
		}else{
			this.callApiFnc()
		}
	}

	callApiFnc(){
		let key = {
			worker:this.worker,
		}
		this.storage.set('filter_value',key)
		this.modalController.dismiss(key)
	}

	reset(){
		this.storage.remove('filter_value')
		this.modalController.dismiss('reset')
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

}
