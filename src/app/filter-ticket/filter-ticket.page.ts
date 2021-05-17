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
  selector: 'app-filter-ticket',
  templateUrl: './filter-ticket.page.html',
  styleUrls: ['./filter-ticket.page.scss'],
})
export class FilterTicketPage implements OnInit {

    user_details:any;
	society:any;
	customers_listing:any;
	setCustomer:any;
	worker_list:any;
	service_plan_list:any;
	customPickerOptions:any;
	customPickerOptions1:any;
	customPickerOptions2:any;
	worker_Id_get:any;
	retain_filter_value:any;
	filterForm: FormGroup;
	customer=undefined;
	worker=undefined;
	select_priority=undefined;
	tickett_type=undefined;
	date=undefined;
	status=undefined;
	customerListHide=false;
	workerListHide=true;
	form_date=null;
	to_date=null;

	constructor(
		private router : Router, 
		private actionSheetController:ActionSheetController,
		public alertController: AlertController,
		public menu: MenuController,
		public globleServiceService:GlobleServiceService,
		private spinner: NgxSpinnerService,
		private storage: Storage,
		public toastController:ToastController,
		private routers : ActivatedRoute,
		private modalController : ModalController,
	) {}
	
	ionViewWillEnter(){
		this.storage.get('filter_value').then((val) => {
			this.retain_filter_value = val
			if(this.retain_filter_value!=null){
				this.customer=this.retain_filter_value.customer
				this.worker=this.retain_filter_value.worker
				this.select_priority=this.retain_filter_value.priority
				this.tickett_type=this.retain_filter_value.type
				this.date=this.retain_filter_value.date
				this.status=this.retain_filter_value.status
				this.form_date=this.retain_filter_value.form_date
				this.to_date=this.retain_filter_value.to_date
				this.society_list()
			}else{
				this.form_date=this.retain_filter_value.form_date
				this.to_date=this.retain_filter_value.to_date
				this.society_list()
			}
		})
	}

	ngOnInit() {
		$(document).ready(function($) {
			$('ion-input').keyup(function(event) {
				var textBox = event.target;
				var start = textBox.selectionStart;
				var end = textBox.selectionEnd;
				textBox.value = textBox.value.charAt(0).toUpperCase() + textBox.value.slice(1).toLowerCase();
				textBox.setSelectionRange(start, end);
			});
		});
	}

	society_list(){
		this.storage.get('user_details').then((val) => {
			this.user_details = val;
		});
	}

	priorityGet(value){
		this.select_priority = value;
	}

	onCancel1(){
		this.select_priority='';
	}

	typeGet(value){
		this.tickett_type = value;
	}

	onCancel2(){
		this.tickett_type='';
	}

	statusfilter(value){
		this.status=value
	}

	onCancel(){
		this.status=''
	}

	onCancel3(){
		this.worker=''
	}

	dismiss(){
		this.modalController.dismiss('reset');
		this.storage.remove('filter_value')
	}

	filterData(){
		if((this.customer=='' || this.customer==undefined || this.customer==null) &&
			(this.worker=='' || this.worker==undefined || this.worker==null) &&
			(this.form_date=='' || this.form_date==undefined || this.form_date==null) &&
			(this.to_date=='' || this.to_date==undefined || this.to_date==null) &&
			(this.select_priority=='' || this.select_priority==undefined || this.select_priority==null) &&
			(this.tickett_type=='' || this.tickett_type==undefined || this.tickett_type==null) &&
			(this.date=='' || this.date==undefined || this.date==null) &&
			(this.status=='' || this.status==undefined || this.status==null)){
			this.alertMsg('Please select atleast one filter')
		}else if(this.form_date!=null && this.to_date==null){
			this.alertMsg('Please select to date')
		}else if(this.form_date==null && this.to_date!=null){
			this.alertMsg('Please select form date')
		}else if(this.form_date!=null && this.to_date!=null){
			if(new Date(this.form_date) > new Date(this.to_date)){
				this.alertMsg('Select To Date greater than Form Date')
			}else{
				this.callApiFnc()
			}
		}else{
			this.callApiFnc()
		}
	}

	callApiFnc(){
		let key = {
			customer:this.customer,
			worker:this.worker,
			priority:this.select_priority,
			type:this.tickett_type,
			date:this.date,
			status:this.status,
			form_date:this.form_date,
			to_date:this.to_date,
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

	getWorkerGet(id,workerName){
		this.worker=workerName
		this.worker_Id_get=id
		this.workerListHide=true;
	}



}
