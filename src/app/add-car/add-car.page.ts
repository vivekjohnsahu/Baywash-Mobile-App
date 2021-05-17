import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Storage } from '@ionic/storage';
import {GlobleServiceService} from '../globle-service.service';
import { ToastController,AlertController} from '@ionic/angular';
import * as $ from 'jquery';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import * as moment from 'moment';
import { Base64 } from '@ionic-native/base64/ngx';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { IonContent } from '@ionic/angular';
import { disableBindings } from '@angular/core/src/render3';
import { ModalController } from '@ionic/angular';
import { NotificationPage } from '../notification/notification.page';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.page.html',
  styleUrls: ['./add-car.page.scss'],
})
export class AddCarPage implements OnInit {

	@ViewChild(IonContent) ionContent: IonContent;
	user_details:any;
	car_company_list:any;
	car_model_list:any;
	car_type_list:any;
	service_plan_list:any;
	worker_list:any;
	Insurance:any;
	noti_count:any;
	returnpath:any;
	Model_hide=false
	Service_hide=false
	day_count_no=['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31']
	day_list=[{day_name:'Monday',hide_day:'1'},{day_name:'Tuesday',hide_day:'2'},{day_name:'Wednesday',hide_day:'3'},{day_name:'Thursday',hide_day:'4'},{day_name:'Friday',hide_day:'5'},{day_name:'Saturday',hide_day:'6'},{day_name:'Sunday',hide_day:'7'}]
	day_list_new=[]
	PollutonTT
	PollutonMM
	PollutonYY
	RegistrationTT
	RegistrationMM
	RegistrationYY
	InsuranceTT
	InsuranceMM
	InsuranceYY
	DrivingTT
	DrivingMM
	DrivingYY
	regular_customer
	customer_name
	provideServicesPlanList
	Plan_Provided_hide=false
	customer_id
	Monthly_Service_error=false
	weekly_Service_error=false
	add_car: FormGroup;
	add_car_guest: FormGroup;
	document_container=true
	loadershow=true
	document
	documentChek='Yes'
	status=1
	monthly_service:any =[]
	service_guest_list
	weekly_service:any =[]
	monthly_selected_length
	weekly_selected_length
	customer_id_only_car
	insuranceFile
	RegistrationFile
	PollutonFile
	DrivingFile
	Monthly_Service_error_cndtion=false
	Monthly_Service_point_cndtion=1
	weekly_service_error_cndtion=false
	weekly_service_point_cndtion=1
	edit
	cmt_id
	type
	DrivingFileSet
	PollutonFileSet
	RegistrationFileSet
	insuranceFileSet
	blnk=0
	formNotSubmit=2
	recently_added_car_type
	morecar
	image
	customer_id_respose

	carData = {
		register_no:"",
		company:"",
		model:"",
		car_type:"",
		service_plan:"",
		select_worker:"",
		service_start_date:"",
		Plan_Provided:'',
	};

	carDataGuest = {
		register_no:"",
		company:"",
		model:"",
		car_type:"",
		service_guest:'',
		service_cost:"",
		select_worker:"",
		service_start_date:"",
	};

	constructor(
		private router:Router,
		public alertController: AlertController,
		public globleServiceService:GlobleServiceService,
		private spinner: NgxSpinnerService,
		private storage: Storage,
		public toastController:ToastController,
		private fileChooser: FileChooser,
		private filePath: FilePath,
		private routers:ActivatedRoute,
		private base64:Base64,
		private modalController:ModalController,
	) { 
		this.add_car = new FormGroup({
			register_no: new FormControl('', [Validators.required]), 
			company: new FormControl('', [Validators.required]), 
			model: new FormControl('', [Validators.required]), 
			car_type: new FormControl('', [Validators.required]), 
			service_plan: new FormControl('', [Validators.required]), 
			select_worker: new FormControl(), 
			service_start_date: new FormControl('', [Validators.required]), 
			Plan_Provided: new FormControl(), 
		});

		this.add_car_guest = new FormGroup({
			register_no: new FormControl('', [Validators.required]), 
			company: new FormControl('', [Validators.required]), 
			model: new FormControl('', [Validators.required]), 
			car_type: new FormControl('', [Validators.required]), 
			select_worker: new FormControl(), 
			service_start_date: new FormControl('', [Validators.required]), 
			service_cost: new FormControl('', [Validators.required]), 
			service_guest: new FormControl('', [Validators.required]), 
		});	

		this.edit=this.routers.snapshot.params['edit']
		this.cmt_id=this.routers.snapshot.params['cmt_id']
		this.type=this.routers.snapshot.params['type']
		this.morecar=this.routers.snapshot.params['morecar']
	}

	ionViewWillEnter(){
		if(this.type!=undefined && this.type!=null && this.type!=''){			
			if(this.type==1){
				this.regular_customer='2'
				this.guestCarData()
			}else{
				this.regular_customer='1'
				this.regularCarData()
			}
			this.storage.get('urlSaveCmt').then((val) => {
				this.customer_id_only_car=val
				this.customer_id_respose=val
			})
			this.storage.get('user_details').then((val) => {
				this.user_details = val;
				this.carCompanyList()
				this.carTypeList()
				this.selectWorker()
				this.servise()
				this.weellCount()
			})
		}else{
			this.storage.get('customer_data').then((val) => {
				this.customer_id=val.user_id
				this.regular_customer=val.customer_type
				this.recently_added_car_type=val.customer_type
				this.customer_name=val.first_name +' '+ val.last_name
			})
			this.storage.get('data_only_car').then((val) => {
				this.recently_added_car_type=val.type
				if(val.type==2){
					this.regular_customer='1'
				}else{
					this.regular_customer='2'
				}
				this.customer_name=val.fname +' '+ val.lname
				this.customer_id_only_car=val.id
				this.customer_id_respose=val.id
		
			})
			this.storage.get('user_details').then((val) => {
				this.user_details = val;
				this.carCompanyList()
				this.carTypeList()
				this.selectWorker()
				this.servise()
				this.weellCount()
			})
		}
	}

	ngOnInit(){
		$.noConflict();
		
	}

	change(vls){
		this.status=vls
	}

	InsuranceTTExp(vls){
		this.InsuranceTT= vls
	}
	RegistrationTTExp(vls){
		this.RegistrationTT= vls
	}
	PollutonTTExp(vls){
		this.PollutonTT= vls
	}
	DrivingTTExp(vls){
		this.DrivingTT= vls
	}

	carCompanyList(){
		this.spinner.show()
		let key={
			apikey:this.globleServiceService.apikey,
		}
		this.globleServiceService.GlobalHit(key,'get_company_list').
		then(data=>{
			this.spinner.hide()
			this.car_company_list=data['company_list'];
		});
	}

	insuranceFileUploade() {
		this.fileChooser.open().then((fileuri)=>{
			this.filePath.resolveNativePath(fileuri).then(
			(resolveNativePath)=>{
				this.insuranceFile = resolveNativePath
				this.insuranceFileSet = resolveNativePath.split("/").splice(-1)
				this.base64.encodeFile(this.insuranceFile).then((toBase64String)=>{
					this.image=toBase64String
					// this.image='data:image/png;base64,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'
					this.spinner.show()
					let key={
						image:this.image,
						apikey:this.globleServiceService.apikey,
					}
					this.globleServiceService.GlobalHit(key,'dummy_doc').
					then(async data=>{
						var dataImage =data['data']
						this.spinner.hide()
						if(dataImage.size_status==false || dataImage.size_status=='false'){
							this.insuranceFileSet=''
							this.alertMsg('File size should not more than 2MB.')
						}else if(dataImage.extension_status==false || dataImage.extension_status=='false'){
							this.insuranceFileSet=''
							this.alertMsg('Please upload allowed type of file ( pdf, doc, docx, jpg, jpeg, gif, png) only.')
						}else{
							this.insuranceFile=toBase64String
						}
					})
				})
			})
		})
	}
	
	RegistrationFileUploade() {
		this.fileChooser.open().then((fileuri)=>{
			this.filePath.resolveNativePath(fileuri).then(
			(resolveNativePath)=>{
				this.RegistrationFile = resolveNativePath
				this.RegistrationFileSet = resolveNativePath.split("/").splice(-1)
				this.base64.encodeFile(this.RegistrationFile).then((toBase64String)=>{
					this.image=toBase64String
					this.spinner.show()
					let key={
						image:this.image,
						apikey:this.globleServiceService.apikey,
					}
					this.globleServiceService.GlobalHit(key,'dummy_doc').
					then(async data=>{
						var dataImage =data['data']
						this.spinner.hide()
						if(dataImage.size_status==false || dataImage.size_status=='false'){
							this.RegistrationFileSet=''
							this.alertMsg('File size should not more than 2MB.')
						}else if(dataImage.extension_status==false || dataImage.extension_status=='false'){
							this.RegistrationFileSet=''
							this.alertMsg('Please upload allowed type of file ( pdf, doc, docx, jpg, jpeg, gif, png) only.')
						}else{
							this.RegistrationFile=toBase64String
						}
					})
				})
			})
		})
	}

	PollutonFileUploade() {
		this.fileChooser.open().then((fileuri)=>{
			this.filePath.resolveNativePath(fileuri).then(
			(resolveNativePath)=>{
				this.PollutonFile = resolveNativePath
				this.PollutonFileSet = resolveNativePath.split("/").splice(-1)
				this.base64.encodeFile(this.PollutonFile).then((toBase64String)=>{
					this.image=toBase64String
					this.spinner.show()
					let key={
						image:this.image,
						apikey:this.globleServiceService.apikey,
					}
					this.globleServiceService.GlobalHit(key,'dummy_doc').
					then(async data=>{
						var dataImage =data['data']
						this.spinner.hide()
						if(dataImage.size_status==false || dataImage.size_status=='false'){
							this.PollutonFileSet=''
							this.alertMsg('File size should not more than 2MB.')
						}else if(dataImage.extension_status==false || dataImage.extension_status=='fales'){
							this.PollutonFileSet=''
							this.alertMsg('Please upload allowed type of file ( pdf, doc, docx, jpg, jpeg, gif, png) only.')
						}else{
							this.PollutonFile=toBase64String
						}
					})
				})
			})
		})
	}
	
	DrivingFileUploade() {
		this.fileChooser.open().then((fileuri)=>{
			this.filePath.resolveNativePath(fileuri).then(
			(resolveNativePath)=>{
				this.DrivingFile = resolveNativePath
				this.DrivingFileSet = resolveNativePath.split("/").splice(-1)
				this.base64.encodeFile(this.DrivingFile).then((toBase64String)=>{
					this.DrivingFile=toBase64String
					this.image=toBase64String
					this.spinner.show()
					let key={
						image:this.image,
						apikey:this.globleServiceService.apikey,
					}
					this.globleServiceService.GlobalHit(key,'dummy_doc').
					then(async data=>{
						var dataImage=data['data']
						this.spinner.hide()
						if(dataImage.size_status==false || dataImage.size_status=='false'){
							this.DrivingFileSet=''
							this.alertMsg('File size should not more than 2MB.')
						}else if(dataImage.extension_status==false || dataImage.extension_status=='false'){
							this.DrivingFileSet=''
							this.alertMsg('Please upload allowed type of file (pdf, doc, docx, jpg, jpeg, gif, png) only.')
						}else{
							this.DrivingFile=toBase64String
						}
					})
				})
			})
		})
	}

	selectCar(vls,blnk){
		this.blnk = this.blnk+1
		if(vls){
			this.Model_hide=true
			this.carModelList(blnk)
		}
	}

	disable_car_type=true
	selectCarType(vls){
		if(vls!=''){
			this.disable_car_type = false
		}else{
			this.disable_car_type = true
		}
		this.Service_hide=true
		this.servisePlan()
	}

	carModelList(blnk){
		var model
		if(this.carData.company!=''){
			model = this.carData.company
		}else{
			model = this.carDataGuest.company
		}
		let key={
			apikey:this.globleServiceService.apikey,
			company_name:model,
		}
		this.globleServiceService.GlobalHit(key,'get_car_model_list').
		then(data=>{
			this.car_model_list=data['car_model_list'];
			if(this.blnk!=1){
				this.carData.model=''
			}
		});
	}
	
	carTypeList(){
		let key={
			apikey:this.globleServiceService.apikey,
		}
		this.globleServiceService.GlobalHit(key,'get_car_type_list').
		then(data=>{
			this.car_type_list=data['get_car_type'];
		});
	}

	servisePlan(){
		let key={
			apikey:this.globleServiceService.apikey,
			car_type:this.carData.car_type,
		}
		this.globleServiceService.GlobalHit(key,'get_service_plan_list').
		then(data=>{
			this.service_plan_list=data['service_plan_list'];
		});
	}

	servise(){
		let key={
			apikey:this.globleServiceService.apikey,
		}
		this.globleServiceService.GlobalHit(key,'get_service_for_guest_car_list').
		then(data=>{
			this.service_guest_list=data['service'];
		});
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

	addCar(){
		if(this.insuranceFile!=undefined || this.RegistrationFile!=undefined || this.PollutonFile!=undefined || this.DrivingFile!=undefined){
			if((this.InsuranceTT=="" || this.InsuranceTT==undefined || this.InsuranceTT==null) && this.insuranceFile!=undefined){
				this.alertMsg('Insurance date cannot be blank')
			}else if((this.RegistrationTT=="" || this.RegistrationTT==undefined || this.RegistrationTT==null) && this.RegistrationFile!=undefined){
				this.alertMsg('Registration date cannot be blank')
			}else if((this.PollutonTT=="" || this.PollutonTT==undefined || this.PollutonTT==null) && this.PollutonFile!=undefined){
				this.alertMsg('Pollution date cannot be blank')
			}else if((this.DrivingTT=="" || this.DrivingTT==undefined || this.DrivingTT==null) && this.DrivingFile!=undefined){
				this.alertMsg('Driving date cannot be blank')
			}else if(this.weekly_service_point_cndtion==2){
				this.weekly_service_error_cndtion=true
			}else if(this.Monthly_Service_point_cndtion==2){
				this.Monthly_Service_error_cndtion=true
			}else{
				this.submitForm()
			}
		}else if(this.weekly_service_point_cndtion==2){
			this.weekly_service_error_cndtion=true
			this.alertMsg("You can't select more than " + this.provideServicesPlanList.Weekly + " week day. Kindly change frequency")
			this.scrollContent('element1')
		}else if(this.Monthly_Service_point_cndtion==2){
			this.Monthly_Service_error_cndtion=true
			this.scrollContent('element2')
			this.alertMsg("You can't select more than " + this.provideServicesPlanList.Monthly + " month day. Kindly change frequency")
		}else{
			this.submitForm()
		}
	}

	scrollContent(scroll) {
		var titleELe = document.getElementById(scroll);
		this.ionContent.scrollToPoint(0, titleELe.offsetTop, 1000);
	}
	
	submitForm(){
		let element1= 'element1'
		if(this.type==undefined || this.type==null || this.type==''){
			this.storage.get('car_add_format').then((val) => {
				if(this.weekly_selected_length!=undefined && this.weekly_service.length==0){
					this.alertMsg('Weekly days can not be empty.')
					this.scrollContent('element1')
					this.weekly_Service_error=true
				}else if(this.monthly_selected_length!=undefined && this.monthly_service.length==0){
					this.alertMsg('Monthly date can not be empty.')
					this.scrollContent('element2')
					this.Monthly_Service_error=true
				}else if(val=='with_user_regular'){
					this.spinner.show()
					let car_data = {
						registration_no:this.carData.register_no,
						company_name:this.carData.company,
						car_model:this.carData.model,
						car_type:this.carData.car_type,
						service_plan:this.carData.service_plan,
						worker_id:this.carData.select_worker,
						service_start_date:this.carData.service_start_date,
						status:this.status,
						number_of_time_provide_service_in_month:this.monthly_service,
						number_of_time_provide_service_in_week:this.weekly_service,
						Plan_Provided:this.carData.Plan_Provided,
						// VVVVVV
					}
					this.document={
						insurance:{
							insuranceFile:this.insuranceFile,
							insuranceExpDate:this.InsuranceTT,
						},
						Registration:{
							RegistrationFile:this.RegistrationFile,
							RegistrationExpDate:this.RegistrationTT,
						},
						Polluton:{
							PollutonFile:this.PollutonFile,
							PollutonExpDate:this.PollutonTT
						},
						Driving:{
							DrivingFile:this.DrivingFile,
							DrivingExpDate:this.DrivingTT,
						},
					}
					this.storage.get('customer_data').then((val) => {
						var key={
							user_data:val,
							car_data:car_data,
							document:this.document,
						}
						this.globleServiceService.GlobalHit(key,'add_customer').
						then(data=>{
							this.spinner.hide()
							if(data['responseCode']==200){
								// this.alertMsgsuccess(data['message'])
								this.storage.remove('customer_data')
								this.customer_id_respose = data['customer_id']
								let key={
									name:this.customer_name,
									type:this.regular_customer,
									recently_added_car_id:data['recently_added_car_id']
								}
								this.storage.set('more_car_data',key)
								this.globleServiceService.saveSingleCarId(data['recently_added_car_id']);
								var setKey={
									recently_added_car_id:data['recently_added_car_id'],
									type:this.recently_added_car_type
								}
								this.storage.set('recently_added_car_id',setKey)
								if(this.monthly_service==''){
									this.monthly_service='null'
								}
								if(this.weekly_service==''){
									this.weekly_service='null'
								}
								// this.router.navigateByUrl('/discount-calculator/' + 'add_regular_customer' +'/'+ this.carData.service_plan +'/'+ this.monthly_service +'/'+ this.weekly_service +'/'+ this.carData.car_type +'/'+ data['customer_id']);
								this.add_regular_customer(data['customer_id'])
							}else if(data['status'].responseCode==401){
								this.alertMsg(data['status'].message)
							}
						});
					})
				}else if(val=='only_car'){
					this.spinner.show()
					let car_data = {
						registration_no:this.carData.register_no,
						company_name:this.carData.company,
						car_model:this.carData.model,
						car_type:this.carData.car_type,
						service_plan:this.carData.service_plan,
						worker_id:this.carData.select_worker,
						service_start_date:this.carData.service_start_date,
						status:this.status,
						number_of_time_provide_service_in_month:this.monthly_service,
						number_of_time_provide_service_in_week:this.weekly_service,
						Plan_Provided:this.carData.Plan_Provided,
						apikey:this.globleServiceService.apikey,
						customer_id:this.customer_id_respose,
					}
					this.document={
						insurance:{
							insuranceFile:this.insuranceFile,
							insuranceExpDate:this.InsuranceTT,
						},
						Registration:{
							RegistrationFile:this.RegistrationFile,
							RegistrationExpDate:this.RegistrationTT,
						},
						Polluton:{
							PollutonFile:this.PollutonFile,
							PollutonExpDate:this.PollutonTT,
						},
						Driving:{
							DrivingFile:this.DrivingFile,
							DrivingExpDate:this.DrivingTT,
						},
					}
					var key={
						car_data:car_data,
						document:this.document,
					}
					this.globleServiceService.GlobalHit(key,'add_car_details').
					then(data=>{
						this.spinner.hide()
						if(data['responseCode']==200){
							let key={
								name:this.customer_name,
								type:this.regular_customer,
								recently_added_car_id:data['recently_added_car_id']
							}
							this.storage.set('more_car_data',key)
							var setKey={
								recently_added_car_id:data['recently_added_car_id'],
								type:this.recently_added_car_type
							}
							this.globleServiceService.saveSingleCarId(data['recently_added_car_id']);
							this.storage.set('recently_added_car_id',setKey)
							if(this.monthly_service==''){
								this.monthly_service='null'
							}
							if(this.weekly_service==''){
								this.weekly_service='null'
							}
							// this.router.navigateByUrl('/discount-calculator/' + 'only_add_customer_car' +'/'+ this.carData.service_plan +'/'+ this.monthly_service +'/'+ this.weekly_service +'/'+ this.carData.car_type +'/'+ this.customer_id_only_car);
							this.only_add_customer_car()
						}else if(data['status'].responseCode==401){
							this.alertMsg(data['status'].message)
						}
					});
				}
			})
		}else{
			let element1= 'element1'
			if(this.weekly_selected_length!=undefined && this.weekly_service.length==0){
				this.alertMsg('Weekly days can not be empty.')
				this.scrollContent('element1')
				this.weekly_Service_error=true
			}else if(this.monthly_selected_length!=undefined && this.monthly_service.length==0){
				this.alertMsg('Monthly date can not be empty.')
				this.scrollContent('element2')
				this.Monthly_Service_error=true
			}else{
				this.spinner.show()
				let car_data = {
					registration_no:this.carData.register_no,
					company_name:this.carData.company,
					car_model:this.carData.model,
					car_type:this.carData.car_type,
					service_plan:this.carData.service_plan,
					worker_id:this.carData.select_worker,
					service_start_date:this.carData.service_start_date,
					status:this.status,
					number_of_time_provide_service_in_month:this.monthly_service,
					number_of_time_provide_service_in_week:this.weekly_service,
					Plan_Provided:this.carData.Plan_Provided,
					apikey:this.globleServiceService.apikey,
					customer_id:this.customer_id_only_car,
					car_id:this.cmt_id,
				}
				this.document={
					insurance:{
						insuranceFile:this.insuranceFile,
						insuranceExpDate:this.InsuranceTT,
					},
					Registration:{
						RegistrationFile:this.RegistrationFile,
						RegistrationExpDate:this.RegistrationTT,
					},
					Polluton:{
						PollutonFile:this.PollutonFile,
						PollutonExpDate:this.PollutonTT,
					},
					Driving:{
						DrivingFile:this.DrivingFile,
						DrivingExpDate:this.DrivingTT,
					},
				}
				var key={
					car_data:car_data,
					document:this.document,
				}
				this.globleServiceService.GlobalHit(key,'editCarDetail').
				then(data=>{
					if(data['responseCode']==200){
						this.alertMsgsuccess(data['message'])
						this.storage.remove('customer_data')
						this.storage.remove('car_add_format')
						this.storage.get('urlReturndata').then((val) => {
							this.spinner.hide()
							this.router.navigateByUrl('/car-details/' + val.id +'/'+val.customer_type +'/'+val.customer_id)
							this.add_car.reset()
							this.monthly_service=[]
							this.add_car_guest.reset()
						})
					}else if(data['status'].responseCode==401){
						this.spinner.hide()
						this.alertMsg(data['status'].message)
					}
				});
			}
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

	provideServicesByServicePlan(){
		var key={
			service_plan:this.carData.service_plan,
			society:this.user_details.society,
			apikey:this.globleServiceService.apikey
		}
		this.globleServiceService.GlobalHit(key,'get_provide_services_by_service_plan').
		then(data=>{
			this.day_list_new=[]
			this.Plan_Provided_hide=true
			this.provideServicesPlanList=data['plan_data'];
			this.carData.Plan_Provided=this.provideServicesPlanList.plan_provided;
			for(let i=0;this.day_list.length>i;i++){
				if(data['plan_data'].weekend!=this.day_list[i].hide_day){
					this.day_list_new.push(this.day_list[i])
				}
			}
			if(this.provideServicesPlanList.Monthly!=undefined || this.provideServicesPlanList.Monthly!='' || this.provideServicesPlanList.Monthly!=null){
				this.monthly_selected_length=this.provideServicesPlanList.Monthly
			}if(this.provideServicesPlanList.Weekly!='' || this.provideServicesPlanList.Weekly!=undefined || this.provideServicesPlanList.Weekly!=null){
				this.weekly_selected_length=this.provideServicesPlanList.Weekly
			}
		});
	}

	servicePlan(){
		this.provideServicesByServicePlan()
	}

	monthlyServicefns(vls){
		if(vls.length>this.monthly_selected_length){
			this.Monthly_Service_error_cndtion=true
			this.Monthly_Service_point_cndtion=2
		}else if(vls.length<=this.monthly_selected_length){
			this.Monthly_Service_error_cndtion=false
			this.Monthly_Service_point_cndtion=1
			this.monthly_service=vls
		}
	}

	daysServicefns(vls){
		if(vls.length>this.weekly_selected_length){
			this.weekly_service_error_cndtion=true
			this.weekly_service_point_cndtion=2
		}else if(vls.length<=this.weekly_selected_length){
			this.weekly_service_error_cndtion=false
			this.weekly_service_point_cndtion=1
			this.weekly_service=vls
		}
	}

	addCarGuest(){
		if((this.type!=undefined || this.type!=null || this.type!='') && this.type==1){
			this.spinner.show()
			let car_data = {
				registration_no:this.carDataGuest.register_no,
				company_name:this.carDataGuest.company,
				car_model:this.carDataGuest.model,
				car_type:this.carDataGuest.car_type,
				service:this.carDataGuest.service_guest,
				service_cost:this.carDataGuest.service_cost,
				worker_id:this.carDataGuest.select_worker,
				service_start_date:moment(this.carDataGuest.service_start_date).format('YYYY-MM-DD'),
				status:this.status,
				apikey:this.globleServiceService.apikey,
				car_id:this.cmt_id,
				customer_id:this.customer_id_only_car
			}
			this.globleServiceService.GlobalHit(car_data,'editGuestCarDetail').
			then(data=>{
				this.storage.get('urlSaveCmt').then((val) => {
					this.spinner.hide()
					if(data['responseCode']==200){
						this.alertMsgsuccess(data['message'])
						this.router.navigateByUrl('/car-details/' + this.cmt_id +'/'+this.type +'/'+val)
						this.storage.remove('urlSaveCmt')
					}else{
						this.alertMsg(data['message'])
					}
				})
			})
		}else{
			this.spinner.show()
			this.storage.get('car_add_format').then((val) => {
				if(val=='only_car'){
					this.storage.get('customer_data').then((val) => {
						let car_data = {
							registration_no:this.carDataGuest.register_no,
							company_name:this.carDataGuest.company,
							car_model:this.carDataGuest.model,
							car_type:this.carDataGuest.car_type,
							service:this.carDataGuest.service_guest,
							service_cost:this.carDataGuest.service_cost,
							worker_id:this.carDataGuest.select_worker,
							service_start_date:moment(this.carDataGuest.service_start_date).format('YYYY-MM-DD'),
							status:this.status,
							apikey:this.globleServiceService.apikey,
							customer_id:this.customer_id_respose,
						}
						var key={
							car_data:car_data,
						}
						this.globleServiceService.GlobalHit(key,'add_guest_car').
						then(data=>{
							this.spinner.hide()
							if(data['responseCode']==200){
								let key={
									name:this.customer_name,
									type:this.regular_customer,
									recently_added_car_id:data['recently_added_car_id']
								}
								this.storage.set('more_car_data',key)
								var setKey={
									recently_added_car_id:data['recently_added_car_id'],
									type:this.recently_added_car_type
								}
								this.globleServiceService.saveSingleCarId(data['recently_added_car_id']);
								this.storage.set('recently_added_car_id',setKey)
								// this.router.navigateByUrl('/discount-calculator/' + 'only_add_guest_customer_car' +'/'+ this.carDataGuest.service_cost +'/'+ this.carDataGuest.car_type +'/'+ this.customer_id_only_car);
								this.only_add_guest_customer_car()
							}else if(data['status'].responseCode==401){
								this.alertMsg(data['status'].message)
							}
						});
					})
				}else{
					this.spinner.show()
					this.storage.get('customer_data').then((val) => {
						let car_data = {
							registration_no:this.carDataGuest.register_no,
							company_name:this.carDataGuest.company,
							car_model:this.carDataGuest.model,
							car_type:this.carDataGuest.car_type,
							services:this.carDataGuest.service_guest,
							services_cost:this.carDataGuest.service_cost,
							worker_id:this.carDataGuest.select_worker,
							service_start_date:moment(this.carDataGuest.service_start_date).format('YYYY-MM-DD'),
							status:this.status,
							apikey:this.globleServiceService.apikey,
							customer_id:this.customer_id,
						}
						var key={
							user_data:val,
							car_data:car_data,
						}
						this.globleServiceService.GlobalHit(key,'add_guest_customer').
						then(data=>{
							this.spinner.hide()
							if(data['responseCode']==200){
								this.storage.remove('customer_data')
								this.customer_id_respose = data['customer_id']
								let key={
									name:this.customer_name,
									type:this.regular_customer,
									recently_added_car_id:data['recently_added_car_id']
								}
								this.storage.set('more_car_data',key)
								var setKey={
									recently_added_car_id:data['recently_added_car_id'],
									type:this.recently_added_car_type
								}
								this.globleServiceService.saveSingleCarId(data['recently_added_car_id']);
								this.storage.set('recently_added_car_id',setKey)
								// this.router.navigateByUrl('/discount-calculator/' + 'add_guest_customer' +'/'+ this.carDataGuest.service_cost +'/'+ this.carDataGuest.car_type +'/'+ data['customer_id']);
								this.add_guest_customer(data['customer_id'])
							}else if(data['status'].responseCode==401){
								this.alertMsg(data['status'].message)
							}
						});
					})
				}
			})
		}
	}

	Monthly_Service_error_Fnc(){
		this.Monthly_Service_error=false
		this.Monthly_Service_error_cndtion=false
	}

	weekly_Service_error_Fnc(){
		this.weekly_Service_error=false
		this.weekly_service_error_cndtion=false
	}

	guestCarData(){
		this.spinner.show()
		this.storage.get('user_details').then((val) => {
		this.user_details = val;
		let key = {
			apikey:this.globleServiceService.apikey,
			car_id: this.cmt_id
		}
		this.globleServiceService.GlobalHit(key,'view_guest_car').
			then(data=>{
				this.carDataGuest.register_no=data['customer_list'].car_details.guest_car_detail.registration_no,
				this.carDataGuest.company=data['customer_list'].car_details.guest_car_detail.company_name,
				this.carDataGuest.model=data['customer_list'].car_details.guest_car_detail.car_model,
				this.carDataGuest.car_type=data['customer_list'].car_details.guest_car_detail.car_type,
				this.carDataGuest.service_cost=data['customer_list'].car_details.guest_car_detail.service_cost,
				this.carDataGuest.select_worker=data['customer_list'].car_details.guest_car_detail.worker_id,
				this.carDataGuest.service_start_date=data['customer_list'].car_details.guest_car_detail.service_start_date,
				this.customer_name=data['customer_list'].car_details.guest_car_detail.customer_name
				this.carDataGuest.service_guest=data['customer_list'].car_details.guest_car_detail.service.split(',')
			})
			this.spinner.hide()
		});
	}

	regularCarData(){
		this.storage.get('user_details').then((val) => {
			this.user_details = val;
			let key = {
				apikey:this.globleServiceService.apikey,
				car_id: this.cmt_id
			}
			this.globleServiceService.GlobalHit(key,'view_car').
			then(async data=>{
				this.carData.register_no=data['customer_list'].car_details.car_detail.registration_no,
				this.carData.company=data['customer_list'].car_details.car_detail.company_name,
				this.carData.model=data['customer_list'].car_details.car_detail.car_model,
				this.carData.car_type=data['customer_list'].car_details.car_detail.car_type,
				this.carData.service_plan=data['customer_list'].car_details.car_detail.service_plan,
				this.carData.select_worker=data['customer_list'].car_details.car_detail.worker_id,
				this.carData.service_start_date=data['customer_list'].car_details.car_detail.service_start_date
				this.provideServicesByServicePlan()
				this.Plan_Provided_hide=true
				this.carData.Plan_Provided=data['customer_list'].plan_provided
				if(data['customer_list'].car_details.car_detail.number_of_time_provide_service_in_week!=null){
					this.weekly_service=data['customer_list'].car_details.car_detail.number_of_time_provide_service_in_week.split(',')
				}
				if(data['customer_list'].car_details.car_detail.number_of_time_provide_service_in_month!=null){
					this.monthly_service=data['customer_list'].car_details.car_detail.number_of_time_provide_service_in_month.split(',')
				}
				this.customer_name=data['customer_list'].car_details.car_detail.customer_name
				if(data['customer_list'].car_details.car_docx[0].image_type=='1'){
					this.insuranceFileSet=data['customer_list'].car_details.car_docx[0].doc_original_name
					this.InsuranceTT=data['customer_list'].car_details.car_docx[0].expery_date
					$("#edited1").attr("value",this.InsuranceTT);
				}else if(data['customer_list'].car_details.car_docx[0].image_type=='2'){
					this.RegistrationFileSet=data['customer_list'].car_details.car_docx[0].doc_original_name
					this.RegistrationTT=data['customer_list'].car_details.car_docx[0].expery_date
					$("#edited4").attr("value",this.RegistrationTT);
					}else if(data['customer_list'].car_details.car_docx[0].image_type=='3'){
					this.PollutonFileSet=data['customer_list'].car_details.car_docx[0].doc_original_name
					this.PollutonTT=data['customer_list'].car_details.car_docx[0].expery_date
					$("#edited7").attr("value",this.PollutonTT);
				}else if(data['customer_list'].car_details.car_docx[0].image_type=='4'){
					this.DrivingFileSet=data['customer_list'].car_details.car_docx[0].doc_original_name
					this.DrivingTT=data['customer_list'].car_details.car_docx[0].expery_date
					$("#edited10").attr("value",this.DrivingTT);
				}
				if(data['customer_list'].car_details.car_docx[1].image_type=='1'){
					this.insuranceFileSet=data['customer_list'].car_details.car_docx[0].doc_original_name
					this.InsuranceTT=data['customer_list'].car_details.car_docx[1].expery_date
					$("#edited1").attr("value",this.InsuranceTT);
				}else if(data['customer_list'].car_details.car_docx[1].image_type=='2'){
					this.RegistrationFileSet=data['customer_list'].car_details.car_docx[1].doc_original_name
					this.RegistrationTT=data['customer_list'].car_details.car_docx[1].expery_date
					$("#edited4").attr("value",this.RegistrationTT);
				}else if(data['customer_list'].car_details.car_docx[1].image_type=='3'){
					this.PollutonFileSet=data['customer_list'].car_details.car_docx[1].doc_original_name
					this.PollutonTT=data['customer_list'].car_details.car_docx[1].expery_date
					$("#edited7").attr("value",this.PollutonTT);
				}else if(data['customer_list'].car_details.car_docx[1].image_type=='4'){
					this.DrivingFileSet=data['customer_list'].car_details.car_docx[1].doc_original_name
					this.DrivingTT=data['customer_list'].car_details.car_docx[1].expery_date
					$("#edited10").attr("value",this.DrivingTT);
				}
				if(data['customer_list'].car_details.car_docx[2].image_type=='1'){
					this.insuranceFileSet=data['customer_list'].car_details.car_docx[2].doc_original_name
					this.InsuranceTT=data['customer_list'].car_details.car_docx[2].expery_date
					$("#edited1").attr("value",this.InsuranceTT);
				}else if(data['customer_list'].car_details.car_docx[2].image_type=='2'){
					this.RegistrationFileSet=data['customer_list'].car_details.car_docx[2].doc_original_name
					this.RegistrationTT=data['customer_list'].car_details.car_docx[2].expery_date
					$("#edited4").attr("value",this.RegistrationTT);
				}else if(data['customer_list'].car_details.car_docx[2].image_type=='3'){
					this.PollutonFileSet=data['customer_list'].car_details.car_docx[2].doc_original_name
					this.PollutonTT=data['customer_list'].car_details.car_docx[2].expery_date
					$("#edited7").attr("value",this.PollutonTT);
				}else if(data['customer_list'].car_details.car_docx[2].image_type=='4'){
					this.DrivingFileSet=data['customer_list'].car_details.car_docx[2].doc_original_name
					this.DrivingTT=data['customer_list'].car_details.car_docx[2].expery_date
					$("#edited10").attr("value",this.DrivingTT);
				}
				if(data['customer_list'].car_details.car_docx[3].image_type=='1'){
					this.insuranceFileSet=data['customer_list'].car_details.car_docx[3].doc_original_name
					this.InsuranceTT=data['customer_list'].car_details.car_docx[3].expery_date
					$("#edited1").attr("value",this.InsuranceTT);
				}else if(data['customer_list'].car_details.car_docx[3].image_type=='2'){
					this.RegistrationFileSet=data['customer_list'].car_details.car_docx[3].doc_original_name
					this.RegistrationTT=data['customer_list'].car_details.car_docx[3].expery_date
					$("#edited4").attr("value",this.RegistrationTT);
				}else if(data['customer_list'].car_details.car_docx[3].image_type=='3'){
					this.PollutonFileSet=data['customer_list'].car_details.car_docx[3].doc_original_name
					this.PollutonTT=data['customer_list'].car_details.car_docx[3].expery_date
					$("#edited7").attr("value",this.PollutonTT);
				}else if(data['customer_list'].car_details.car_docx[3].image_type=='4'){
					this.DrivingFileSet=data['customer_list'].car_details.car_docx[3].doc_original_name
					this.DrivingTT=data['customer_list'].car_details.car_docx[3].expery_date
					$("#edited10").attr("value",this.DrivingTT);
				}
				this.spinner.hide()
			})
		});
	}

	
	changeDocument(vls){
		if(vls=='Yes'){
			this.document_container=true
			if(this.edit=='edit'){
				this.regularCarData()
			}
		}else{
			this.document_container=false
		}
	}

	backPage(){
		this.router.navigateByUrl('/customer-listing')
	}

	selectModel(vls){
		let key = {
			apikey:this.globleServiceService.apikey,
			id: vls
		}
		this.globleServiceService.GlobalHit(key,'get_car_type').
		then(async data=>{
			this.carDataGuest.car_type=data['car_type'].id
			this.carData.car_type=data['car_type'].id
		})
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

	async add_regular_customer(id){
		const alert = await this.alertController.create({
			message: 'Do you want to add more car?',
			cssClass:'custom-ios-alert',
			backdropDismiss: false,
			buttons: [
				{
					text: 'No',
					role: 'cancel',
					cssClass: 'secondary',
					handler: () => {
						this.router.navigateByUrl('/discount-calculator/' + 'add_regular_customer' +'/'+ this.carData.service_plan +'/'+ this.monthly_service +'/'+ this.weekly_service +'/'+ this.carData.car_type +'/'+ id);
					}
				},{
					text: 'Add More',
					handler: () => {
						this.add_car.reset()
						this.Model_hide=false
						this.scrollContent('TopPage')
						this.storage.set('car_add_format','only_car')	
						this.document_container=false	
						setTimeout(() => {
							this.Plan_Provided_hide=false
							this.Service_hide=false
							this.weekly_service=[]
							this.monthly_service=[]
							this.blankFilesDock()
						}, 800);				
					}
				}]
			});
		await alert.present();
	}

	async only_add_customer_car(){
		const alert = await this.alertController.create({
			message: 'Do you want to add more car?',
			cssClass:'custom-ios-alert',
			backdropDismiss: false,
			buttons: [
				{
					text: 'No',
					role: 'cancel',
					cssClass: 'secondary',
					handler: () => {
						this.globleServiceService.chekPageCustomer('false')
						this.router.navigateByUrl('/discount-calculator/' + 'only_add_customer_car' +'/'+ this.carData.service_plan +'/'+ this.monthly_service +'/'+ this.weekly_service +'/'+ this.carData.car_type +'/'+ this.customer_id_respose);
					}
				},{
					text: 'Add More',
					handler: () => {
						this.add_car.reset()
						this.Model_hide=false
						this.scrollContent('TopPage')
						this.storage.set('car_add_format','only_car')
						this.document_container=false	
						setTimeout(() => {
							this.Plan_Provided_hide=false
							this.Service_hide=false
							this.weekly_service=[]
							this.monthly_service=[]
							this.blankFilesDock()
						}, 800);				
					}
				}]
			});
		await alert.present();
	}
	
	async only_add_guest_customer_car(){
		const alert = await this.alertController.create({
			message: 'Do you want to add more car?',
			cssClass:'custom-ios-alert',
			backdropDismiss: false,
			buttons: [
				{
					text: 'No',
					role: 'cancel',
					cssClass: 'secondary',
					handler: () => {
						this.globleServiceService.chekPageCustomer('false')
						this.router.navigateByUrl('/discount-calculator/' + 'only_add_guest_customer_car' +'/'+ this.carDataGuest.service_cost +'/'+ this.carDataGuest.car_type +'/'+ this.customer_id_respose);
					}
				},{
					text: 'Add More',
					handler: () => {
						this.add_car_guest.reset()
						this.Model_hide=false
						this.scrollContent('TopPage')	
						this.storage.set('car_add_format','only_car')	
						setTimeout(() => {
							this.disable_car_type=true
						}, 300);			
					}
				}]
			});
		await alert.present();
	}
	async add_guest_customer(id){
		const alert = await this.alertController.create({
			message: 'Do you want to add more car?',
			cssClass:'custom-ios-alert',
			backdropDismiss: false,
			buttons: [
				{
					text: 'No',
					role: 'cancel',
					cssClass: 'secondary',
					handler: () => {
						this.router.navigateByUrl('/discount-calculator/' + 'add_guest_customer' +'/'+ this.carDataGuest.service_cost +'/'+ this.carDataGuest.car_type +'/'+ id);
					}
				},{
					text: 'Add More',
					handler: () => {
						this.add_car_guest.reset()
						this.Model_hide=false
						this.scrollContent('TopPage')	
						this.storage.set('car_add_format','only_car')
						setTimeout(() => {
							this.disable_car_type=true
						}, 300);				
					}
				}]
			});
		await alert.present();
	}

	blankFilesDock(){
		this.insuranceFile=undefined
		this.insuranceFileSet=''
		this.RegistrationFile=undefined
		this.RegistrationFileSet=''
		this.PollutonFile=undefined
		this.PollutonFileSet=''
		this.DrivingFile=undefined
		this.DrivingFileSet=''
		this.InsuranceTT=''
		$("#edited1").attr("value",this.InsuranceTT);
		this.RegistrationTT=''
		$("#edited4").attr("value",this.RegistrationTT);
		this.PollutonTT=''
		$("#edited7").attr("value",this.PollutonTT);
		this.DrivingTT=''
		$("#edited10").attr("value",this.DrivingTT);
		this.document_container=true
		this.documentChek='Yes'
	}

}
