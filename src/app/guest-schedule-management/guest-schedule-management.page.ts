import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
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
import { FilterGuestSchedulePage } from '../filter-guest-schedule/filter-guest-schedule.page';
import { IonInfiniteScroll } from '@ionic/angular';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import { NotificationPage } from '../notification/notification.page';

@Component({
  selector: 'app-guest-schedule-management',
  templateUrl: './guest-schedule-management.page.html',
  styleUrls: ['./guest-schedule-management.page.scss'],
})
export class GuestScheduleManagementPage implements OnInit {

	@ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
	@ViewChild('printSection', { read: ElementRef }) printSection: ElementRef;
    date:any
	user_details:any
	scheduleList=[]
	not_done_schedul_status:any
	reschedule_job_status:any
	reschedule_job_date:any
	NotDoneSchedulePopup=false
	reScheduleJobPopup=false
	worker_id=[]
	supervisor_id=[]
	id_customer=[]
	customer_id=[]
	jobDate=[]
	key_return_value:any
	filter_Data_return=''
	noti_count:any
	user_id:any
	workerId:any
	page=1
	no_data_found=0
	society_id
	keyChek=[]
	jobDonebottomDis=0
	loader_footer=true
	month1
	day123
	workerName
	job_date
	dateChek=[]
	dateChekChek=0

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
		private printer: Printer
	) {
		this.workerId=this.routers.snapshot.params['workerId']
		this.workerName=this.routers.snapshot.params['workerName']
		this.job_date=this.routers.snapshot.params['job_date']
		// this.society_list()
	}

	ngOnInit() {}

	ionViewWillEnter(){
		this.society_list()
	}

	// Reassig worker
	reassignWorker(){
		this.router.navigateByUrl('/assign-worker')	
	}

	reassignPage(jobDate,id){
		this.router.navigateByUrl('/guest-reassign' +'/'+ jobDate +'/'+ id)	
		if(this.routers.snapshot.params['workerName']!=undefined){
			var obj = {
				workerId:this.workerId=this.routers.snapshot.params['workerId'],
				workerName:this.workerName=this.routers.snapshot.params['workerName'],
				job_date:this.job_date=this.routers.snapshot.params['job_date'],
			}
			this.storage.set('valueObj',obj)
		}
	}

	society_list(){
		this.page=1
		this.scheduleList=[]
		this.storage.get('user_details').then((val) => {
			this.user_details = val;
			this.user_id = val.user_id;
			this.society_id=val.society
			if(this.filter_Data_return!=undefined || this.filter_Data_return!=null || this.filter_Data_return!=''){
				this.filteListDateUser(this.filter_Data_return)
			}else{
				this.schedule_list()
			}
			this.weellCount()
		});
	}
	
	schedule_list(){
		this.spinner.show()
		let key={apikey:this.globleServiceService.apikey,user_id:this.user_id,page:this.page,real_id:this.workerId,society:this.society_id}
		this.globleServiceService.GlobalHit(key,'schedule_guest_list').
		then(data=>{
			this.spinner.hide()
			if(data['responseCode']==200){
				this.no_data_found = 1
				this.scheduleList=this.scheduleList.concat(data['customer_list'].schedule_guest_list.data)
				this.scheduleList=data['customer_list'].schedule_guest_list.data
			}else{
				this.no_data_found = 2
			}
		});
	}

	back(){
		this.storage.remove('filter_value')
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


	openModelHide(){
		this.NotDoneSchedulePopup=false
		this.reScheduleJobPopup=false
	}

	// Not Done Schedule function start
	NotDoneSchedule(){
		if(this.id_customer.length==0){
			this.alertMsg('Please select atleast one record')
		}else{
			let currentDate =moment(new Date).format('YYYY-MM-DD')
			var chekDate = 1
			for(let i=0;this.jobDate.length>i;i++){
				let arrayDate = moment(this.jobDate[i]).format('YYYY-MM-DD')
				if(new Date(currentDate) < new Date(arrayDate)){
					this.alertMsg("Future jobs can't be allowed")
					chekDate = 0
					return false
				}
			}
			if(chekDate==1){
				this.NotDoneSchedulePopup=true
			}
		}
	}

	notDoneSchedulStatus(vls){
		this.not_done_schedul_status=vls
	}

	NotDoneScheduleSubmitPopup(){
		if(this.not_done_schedul_status==undefined){
			this.alertMsg('Please select Reason')
		}else{
			this.spinner.show()
			var id_customer_new=this.id_customer.join();
			let key={
				apikey:this.globleServiceService.apikey,
				work_not_done_reason:this.not_done_schedul_status,
				id:id_customer_new,
				status:'2',
			}
			this.globleServiceService.GlobalHit(key,'guest_work_not_done').
			then(data=>{
				if(data['responseCode']=='200'){
					this.alertMsgsuccess(data['message'])
					this.NotDoneSchedulePopup=false
					this.blankArray()
					this.not_done_schedul_status=''
					this.filteListDateUser(this.filter_Data_return)
					this.keyChek=[]
					this.jobDonebottomDis = 0
				}else{
					this.spinner.hide()
					this.alertMsg(data['message'])
				}
			});
		}
	}
	// Not Done Schedule function end

	// Reschedule Job function start
	RescheduleJob(){
		
		if(this.id_customer.length==0){
			this.alertMsg('Please select atleast one record')
		}else{
			$(function(){
				var dtToday = new Date();
				this.month1 = dtToday.getMonth() + 1;
				this.day123 = dtToday.getDate();
				var year = dtToday.getFullYear();
				if(this.month1 < 10)
					this.month1 = '0' + this.month1.toString();
				if(this.day123 < 10)
					this.day123 = '0' + this.day123.toString();
					var maxDate = year + '-' + this.month1 + '-' + this.day123;
					$('#txtDate').attr('min', maxDate);
			});
			this.reschedule_job_date= moment(this.reschedule_job_date).format('YYYY-MM-DD')
			this.reScheduleJobPopup=true
		}
	}

	rescheduleJobStatus(vls){
		this.reschedule_job_status=vls
	}

	selectDateInReschedule(vls){
		this.reschedule_job_date=moment(vls).format('DD/MM/YYYY')
	}

	RescheduleJobSubmitPopup(){
		if(this.reschedule_job_date==undefined || this.reschedule_job_date==''){
			this.alertMsg('Please select Job Date')
		}else if(this.reschedule_job_status==undefined){
			this.alertMsg('Please select Reason')
		}else{
			this.spinner.show()
			var supervisor_id_new = this.supervisor_id.join();
			var id_customer_new=this.id_customer.join();
			var worker_id_new=this.worker_id.join();
			var customer_id_new=this.customer_id.join();
			let key={
				apikey:this.globleServiceService.apikey,
				ids:id_customer_new,
				cust_ids:customer_id_new,
				supr_ids:supervisor_id_new,
				wrkr_ids:worker_id_new,
				dateVal:this.reschedule_job_date,
				reschedule_reason:this.reschedule_job_status
			}
			this.globleServiceService.GlobalHit(key,'guest_reschedule_worker').
			then(data=>{
				if(data['responseCode']=='200'){
					this.alertMsgsuccess(data['message'])
					this.reScheduleJobPopup=false
					this.blankArray()
					this.reschedule_job_status=''
					this.filteListDateUser(this.filter_Data_return)
					this.keyChek=[]
					this.jobDonebottomDis = 0
				}else{
					this.spinner.hide()
					this.alertMsg(data['message'])
				}
			});
		}
	}
	// Reschedule Job function end
	
	// Run Schedule function start
	async runSchedule(){
		const alert = await this.alertController.create({
			message: 'Do you want to run schedule job?',
			cssClass:'custom-ios-alert',
			buttons: [
				{
					text: 'No',
					role: 'cancel',
					cssClass: 'secondary',
				},{
					text: 'Yes',
					handler: () => {
						this.openPopupRunSchedule()
					}
				}]
			});
		await alert.present();	
	}

	openPopupRunSchedule(){
		this.spinner.show()
		let key={apikey:this.globleServiceService.apikey,}
		this.globleServiceService.GlobalHit(key,'create_guest_customer_schedual').
		then(data=>{
			if(data['responseCode']=='200'){
				this.alertMsgsuccess(data['message'])
				this.filteListDateUser(this.filter_Data_return)
			}else{
				this.spinner.hide()
				this.alertMsg(data['message'])
			}
		})
	}
	// Run Schedule function end

	// Done Schedule function start
	async DoneSchedule(){
		if(this.id_customer.length==0){
			this.alertMsg('Please select atleast one record')
		}else{
			this.openPopupDoneschdl()
		}
	}

	async openPopupDoneschdl(){
		const alert = await this.alertController.create({
			message: 'Do you want to have the schedule done?',
			cssClass:'custom-ios-alert',
			buttons: [
				{
					text: 'No',
					role: 'cancel',
					cssClass: 'secondary',
				},{
					text: 'Yes',
					handler: () => {
						this.DoneScheduleAPiCall()
					}
				}]
			});
		await alert.present();	
	}

	DoneScheduleAPiCall(){
		this.spinner.show()
		var id_customer_new=this.id_customer.join();
		let key={
			apikey:this.globleServiceService.apikey,
			id:id_customer_new,
			status:'1'
		}
		this.globleServiceService.GlobalHit(key,'guest_work_done').
		then(data=>{
			if(data['responseCode']=='200'){
				this.alertMsgsuccess(data['message'])
				this.blankArray()
				this.filteListDateUser(this.filter_Data_return)
				this.keyChek=[]
				this.jobDonebottomDis = 0
			}else{
				this.spinner.hide()
				this.alertMsg(data['message'])
			}
		})
	}

	scheduleSelect(index,id,supervisor_id,worker_id,customer_id,jobDate,key_returned,frequency){
		if($("#checkbox_"+id).is(':checked') == true){
			this.id_customer.push(id)
			this.supervisor_id.push(supervisor_id)
			this.worker_id.push(worker_id)
			this.customer_id.push(customer_id)
			this.jobDate.push(jobDate)
			if(key_returned!='Yes'){
				this.keyChek.push(id)
			}
			let currentDate =moment(new Date).format('YYYY-MM-DD')
			let arrayDate = moment(jobDate).format('YYYY-MM-DD')
			if(new Date(currentDate) < new Date(arrayDate)){
				this.dateChek.push(id)
			}
		}
		else if($("#checkbox_"+id).is(':checked') == false){
			var a=this.id_customer.indexOf(id)
			this.id_customer.splice(a, 1)
			this.supervisor_id.splice(a, 1)
			this.worker_id.splice(a, 1)
			this.customer_id.splice(a, 1)
			this.jobDate.splice(a, 1)
			var result = this.keyChek.filter(function(elem){return elem != id; });
			this.keyChek = result
			var result2 = this.dateChek.filter(function(elem){return elem != id; });
			this.dateChek = result2
		}
		if(this.keyChek.length>0){
			this.jobDonebottomDis = 1
		}else{
			this.jobDonebottomDis = 0
		}
		if(this.dateChek.length>0){
			this.dateChekChek = 1
		}else{
			this.dateChekChek = 0
		}
		this.chekDoneClass()
	}

	blankArray(){
		this.id_customer=[]
		this.supervisor_id=[]
		this.worker_id=[]
		this.customer_id=[]
		this.jobDate=[]
	}

	keyReturn(vls,id,key_returned){
		this.key_return_value=vls
		this.keyReturnACll(vls,id)
		if(vls=='Yes'){
			var result = this.keyChek.filter(function(elem){return elem != id; });
			this.keyChek = result
			$('#icon_right_true_'+id).css('display','block');
			$('#icon_cancel_false_'+id).css('display','block');
			$('#icon_right_false_'+id).css('display','none');
			$('#icon_cancel_true_'+id).css('display','block');
			$("#checkbox_"+id).prop('checked', false)
			var a=this.id_customer.indexOf(id)
			this.id_customer.splice(a, 1)
		}
		if(vls=='No'){
			this.keyChek.push(id)
			var a=this.id_customer.indexOf(id)
			this.id_customer.splice(a, 1)
			this.supervisor_id.splice(a, 1)
			this.worker_id.splice(a, 1)
			this.customer_id.splice(a, 1)
			this.jobDate.splice(a, 1)
			$("#checkbox_"+id).prop('checked', false)
			$('#icon_right_false_'+id).css('display','block');
			$('#icon_cancel_true_'+id).css('display','block');
			$('#icon_right_true_'+id).css('display','none');
			$('#icon_cancel_false_'+id).css('display','none');
		}
		this.chekDoneClass()
	}

	chekDoneClass(){
		var chekNO='1';
		$(".comanChekByClass").each(function() {
			if(chekNO!='3'){
				chekNO='2';
			}
			var currentId = $(this).attr('name')
			if($('input[name='+currentId+']:checked').val()== 'Yes'){
				// Nothing
			}else{
				if($('input[name='+currentId+']:checked').val()== 'No'){
					var chekBoxId = $(this).attr('lang')
					if($('#'+chekBoxId).is(':checked') == true){
						if(chekNO!='3'){
							chekNO='3';
						}
					}
				}
			}
		})
		if(chekNO!='1'){
			if(chekNO=='3'){
				this.jobDonebottomDis = 1
			}else{
				this.jobDonebottomDis = 0
			}
		}
	}

	keyReturnACll(vls,id){
		let key={
			apikey:this.globleServiceService.apikey,
			id:id,
			key_returned:vls,
		}
		this.globleServiceService.GlobalHit(key,'guest_key_returned').
		then(data=>{});
	}

	async filterList(){
		this.page=1
		this.scheduleList=[]
		this.spinner.show()
		const modal = await this.modalController.create({
			component: FilterGuestSchedulePage
		})
		await modal.present();
		this.spinner.hide()
		this.page=1
		this.id_customer=[]
		this.scheduleList=[]
		const { data } = await modal.onWillDismiss();
		this.filter_Data_return=data
		if(this.filter_Data_return!='reset'){
			this.loader_footer=false
			this.filteListDate(this.filter_Data_return)
		}else{
			this.workerId=undefined,
			this.job_date=undefined,
			this.job_date=undefined,
			this.schedule_list()
			this.loader_footer=true
		}
	}

	filteListDate(data){
		this.spinner.show()
		let key
		if(data.customer!=undefined){
			key={
				apikey:this.globleServiceService.apikey,
				user_id:this.user_id,
				customer_id:data.customer,
				worker_id:data.worker,
				service_id:data.service,
				status:data.status,
				s_date:data.form_date,
				e_date: data.to_date,
				society:this.society_id,
				page:this.page
			}	
		}else{
			key={
				apikey:this.globleServiceService.apikey,
				user_id:this.user_id,
				real_id:this.workerId,
				service_id:data.service,
				status:data.status,
				s_date:this.job_date,
				e_date: this.job_date,
				society:this.society_id,
				page:this.page
			}	
		}
		this.globleServiceService.GlobalHit(key,'schedule_guest_list').
		then(data=>{
			this.spinner.hide()
			if(data['responseCode']==200){
				this.no_data_found = 1
				this.scheduleList=this.scheduleList.concat(data['customer_list'].schedule_guest_list.data)
			}else{
				this.no_data_found = 2
			}
		});
	}

	filteListDateUser(data){
		this.spinner.show()
		if(this.workerId!=undefined && data.worker==undefined){
			let key={
				apikey:this.globleServiceService.apikey,
				user_id:this.user_id,
				customer_id:data.customer,
				real_id:this.workerId,
				service_id:data.service,
				status:data.status,
				s_date:this.job_date,
				e_date: this.job_date,
				society:this.society_id
			}
			this.globleServiceService.GlobalHit(key,'schedule_guest_list').
			then(data=>{
				this.spinner.hide()
				if(data['responseCode']==200){
					this.no_data_found = 1
					this.scheduleList=data['customer_list'].schedule_guest_list.data
				}else{
					this.no_data_found = 2
				}
				let key = {
					worker:this.workerName,
					form_date:this.job_date,
					to_date:this.job_date,
				  }
				this.storage.set('filter_value',key)
			});
		}else{
			let key={
				apikey:this.globleServiceService.apikey,
				user_id:this.user_id,
				customer_id:data.customer,
				worker_id:data.worker,
				service_id:data.service,
				status:data.status,
				s_date:data.form_date,
				e_date: data.to_date,
				society:this.society_id
			}
			this.globleServiceService.GlobalHit(key,'schedule_guest_list').
			then(data=>{
				this.spinner.hide()
				if(data['responseCode']==200){
					this.no_data_found = 1
					this.scheduleList=data['customer_list'].schedule_guest_list.data
				}else{
					this.no_data_found = 2
				}
			});
		}
	}

	singleSchedule(index,id,supervisor_id,worker_id,customer_id,jobDate){
		this.blankArray()
		this.id_customer.push(id)
		this.DoneSchedule()
	}
	
	singleNotDone(id,jobDate){
		this.blankArray()
		this.id_customer.push(id)
		this.jobDate.push(jobDate)
		this.NotDoneSchedule()
	}

	loadData(event) {
		this.page = this.page+1
		this.schedule_list_load()
		setTimeout(() => {
			event.target.complete();
			if (this.scheduleList.length == 1000) {
				event.target.disabled = true;
			}
		}, 500);
	}

	printData(){
		let printContent = document.getElementById('printMe');
		let options: PrintOptions = {
			name: 'Guest Schedule',
			duplex: true,
		};
		this.printer.print(printContent, options);
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

	schedule_list_load(){
		let key={apikey:this.globleServiceService.apikey,user_id:this.user_id,page:this.page,real_id:this.workerId,society:this.society_id}
		this.globleServiceService.GlobalHit(key,'schedule_guest_list').
		then(data=>{
			if(data['responseCode']==200){
				this.no_data_found = 1
				this.scheduleList=this.scheduleList.concat(data['customer_list'].schedule_guest_list.data)
			}
		});
	}

	alertmagissue(){
		if(this.dateChekChek==1){
			this.alertMsg("Future jobs can't be allowed")
		}else{
			this.alertMsg('Please return the Keys first of selected jobs')
		}
	}
	
}
