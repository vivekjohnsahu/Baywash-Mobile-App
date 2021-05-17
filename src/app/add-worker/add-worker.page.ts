import { Component, OnInit } from '@angular/core';
import { NavController,AlertController,ActionSheetController, ToastController,Platform } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import {GlobleServiceService} from '../globle-service.service'
import { AppComponent } from '../app.component'
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-worker',
  templateUrl: './add-worker.page.html',
  styleUrls: ['./add-worker.page.scss'],
})
export class AddWorkerPage implements OnInit {

	addWorkerData: FormGroup;
	user_details:any
	supervisor_list:any;
	user_id:any;
	access_token:any;
	worker_id:any;
	society:any;
		worker = {
		firstname:"",
		lastname:"",
		email:"",
		number:"",
		supervisor:"",
		society:"",
		date:"",
		Qualification:"",
		salary:"",
		documents:"",
		permanent_address:"",
		current_address:"",
	};
	
	constructor(
		private router : Router,
		public toastController:ToastController, 
		private storage:Storage,
		private routers:ActivatedRoute,
		public alertController:AlertController,
		private globleServiceService:GlobleServiceService,
		private appComponent:AppComponent,
		private spinner: NgxSpinnerService, 
	) { 
		//  validation pattern start
		let email_pattern = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
		this.addWorkerData = new FormGroup({
		firstname: new FormControl('', [Validators.required]),
		lastname: new FormControl(),      
		email: new FormControl('', [Validators.required, Validators.pattern(email_pattern)]),             
		number: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(14)]),
		supervisor: new FormControl('', [Validators.required]),
		society: new FormControl('', [Validators.required]),
		date: new FormControl('', [Validators.required]),
		Qualification: new FormControl('', [Validators.required]),
		salary: new FormControl('', [Validators.required]),
		documents: new FormControl(),
		permanent_address: new FormControl('', [Validators.required]),
		current_address: new FormControl('', [Validators.required]),
		});

		//  Worker Id 
		this.worker_id=this.routers.snapshot.params['id']
		if(this.worker_id!='' && this.worker_id!=null &&  this.worker_id!=undefined){
			this.WorkerDetailsPage()
		}
	}

	ngOnInit() {
	}

	ionViewWillEnter(){
		this.worker_list()
	}

	// Add Worker in form
	addWorker(){
		this.spinner.show()
		this.storage.get('user_details').then((val) => {
			this.user_details = val;
			let key={
				apikey:this.globleServiceService.apikey,
				access_token:this.user_details.access_token,
				user_id:this.user_details.user_id,
				fisrt_name:this.worker.firstname,
				last_name:this.worker.lastname,
				phone_no:this.worker.number,
				supervisor:this.worker.supervisor,
				society:this.worker.society,
				qualification:this.worker.Qualification,
				current_salary:this.worker.current_address,
				uploaded_documents:this.worker.documents,
				current_r_address:this.worker.current_address,
				p_r_address:this.worker.permanent_address,
				status:'1',
				email:this.worker.email,
				date_of_joining:this.worker.date
				// Submit :Submit
			}
			this.globleServiceService.GlobalHit(key,'add_worker').
			then(async data=>{
				this.spinner.hide()
			})
		})
	}

	// worker list show
	worker_list(){
		this.storage.get('user_details').then((val) => {
			this.user_details = val;
			this.user_id=this.user_details.user_id,
			this.access_token=this.user_details.access_token
			let key = {
				apikey:this.globleServiceService.apikey,
				user_id:this.user_details.user_id,
				access_token:this.user_details.access_token
			}
			this.globleServiceService.GlobalHit(key,'get_worker_list').
			then(async data=>{
				this.supervisor_list=data['customer_list'].supervisor_list
				this.society=data['customer_list'].society_list
			})
		});
	}

	WorkerDetailsPage(){
		this.storage.get('user_details').then((val) => {
		this.user_details = val;
			let key = {
				apikey:this.globleServiceService.apikey,
				user_id:this.user_details.user_id,
			}
			this.globleServiceService.GlobalHit(key,'view_worker').
			then(data=>{
			})
		})
	}

}
