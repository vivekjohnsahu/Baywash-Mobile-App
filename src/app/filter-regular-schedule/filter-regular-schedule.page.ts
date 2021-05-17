import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute, RoutesRecognized , Navigation } from '@angular/router';
import { ToastController, NavController,AlertController,ActionSheetController, MenuController, IonSlides, Platform  } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NgxSpinnerService } from 'ngx-spinner';
import { Storage } from '@ionic/storage';
import {GlobleServiceService} from '../globle-service.service';
import * as moment from 'moment';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter-regular-schedule',
  templateUrl: './filter-regular-schedule.page.html',
  styleUrls: ['./filter-regular-schedule.page.scss'],
})
export class FilterRegularSchedulePage implements OnInit {

  user_details:any;
	society:any;
	customers_listing:any;
	setCustomer:any;
	worker_list:any;
	service_plan_list:any;
	customPickerOptions:any;
	customPickerOptions2:any;
  	retain_filter_value:any;
	filterForm: FormGroup;

	filterValue = {
		customer:'',
		worker:'',
		service:undefined,
		status:undefined,
		form_date:null,
		to_date:null,
	};

	constructor(
		public modalController: ModalController,
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
	) {
		this.filterForm = new FormGroup({
			// title: new FormControl('', [Validators.required]),
			customer: new FormControl(),
			worker: new FormControl(),
			service: new FormControl(),
			status: new FormControl(),
			form_date: new FormControl(),
			to_date: new FormControl(),
		})

		this.customPickerOptions = {
			buttons: [{
			text: 'Cancel',
			handler: () => {
				this.filterValue.form_date=null
			}
			}, {
			text: 'Done',
			handler: (value) => {
        		const valueMo = value.year.value +'-'+ value.month.value +'-'+ value.day.value
				this.filterValue.form_date=valueMo
				}
			}]
		}

		this.customPickerOptions2 = {
			buttons: [{
			text: 'Cancel',
			handler: () => {
				this.filterValue.to_date=null
			}
			}, {
			text: 'Done',
			handler: (value) => {
        		const valueMo = value.year.value +'-'+ value.month.value +'-'+ value.day.value
				this.filterValue.to_date=valueMo
				}
			}]
		}
  }
  
    ionViewWillEnter(){
		this.storage.get('filter_value').then((val) => {
			this.retain_filter_value = val
			if(this.retain_filter_value!=null){
        		this.society_list()
				this.filterValue.customer=this.retain_filter_value.customer
				this.filterValue.worker=this.retain_filter_value.worker
				this.filterValue.service=this.retain_filter_value.service
				this.filterValue.status=this.retain_filter_value.status
				this.filterValue.form_date=this.retain_filter_value.form_date
				this.filterValue.to_date=this.retain_filter_value.to_date
			}else{
				this.society_list()
			}
		})
		this.filterValue.form_date=moment(new Date()).format('YYYY-MM-DD')
		this.filterValue.to_date=moment(new Date()).format('YYYY-MM-DD')
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
			this.servisePlan()
		});
	}

	dismiss(){
		this.callApiFnc()
  	}
  
	reset(){
		this.storage.remove('filter_value')
		this.modalController.dismiss('reset')
		this.filterForm.reset()
	}
  
	filterData(){
		if((this.filterValue.customer=='' || this.filterValue.customer==undefined || this.filterValue.customer==null) &&
			(this.filterValue.worker=='' || this.filterValue.worker==undefined || this.filterValue.worker==null) &&
			(this.filterValue.form_date=='' || this.filterValue.form_date==undefined || this.filterValue.form_date==null) &&
			(this.filterValue.to_date=='' || this.filterValue.to_date==undefined || this.filterValue.to_date==null) &&
			(this.filterValue.status=='' || this.filterValue.status==undefined || this.filterValue.status==null)){
				this.alertMsg('Please select atleast one filter')
		}else if(this.filterValue.form_date!=null && this.filterValue.to_date==null){
			this.alertMsg('Please select to date')
		}else if(this.filterValue.form_date==null && this.filterValue.to_date!=null){
			this.alertMsg('Please select form date')
		}else if(this.filterValue.form_date!=null && this.filterValue.to_date!=null){
			if(new Date(this.filterValue.form_date) > new Date(this.filterValue.to_date)){
				this.alertMsg('Select To Date greater than Form Date')
			}else{
				this.callApiFnc()
			}
		}else{
			this.callApiFnc()
		}
	}

  callApiFnc(){
	//   if(this.filterValue.form_date.match()){

	//   }
      let key = {
        customer:this.filterValue.customer,
        worker:this.filterValue.worker,
        service:this.filterValue.service,
        status:this.filterValue.status,
        form_date:this.filterValue.form_date,
        to_date:this.filterValue.to_date,
		chek_date:this.value_set
      }
	//   console.log(key)
	  this.storage.set('filter_value',key)
	//   this.router.navigateByUrl('/schedule-management')
	//   setTimeout(() => {
		  this.modalController.dismiss(key)
	//   }, 1000);	
	  this.value_set=0
    }
  
  	getWorkerGet(id,workerName){
		this.filterValue.worker=workerName
	}

	customerGet(id,fname,lname){
		this.filterValue.customer = fname+' '+lname
	}

	servisePlan(){
		let key={
			apikey:this.globleServiceService.apikey,
		}
		this.globleServiceService.GlobalHit(key,'service_list').
		then(data=>{
			this.service_plan_list=data['service_list'].service_list;
		});
	}

	value_set=0
	formDate(vls){
		this.value_set=1
		console.log(this.value_set)
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
