import { Component, OnInit } from '@angular/core';
import {GlobleServiceService} from '../globle-service.service'
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AlertController, Events, MenuController, Platform } from '@ionic/angular';
import { AppComponent } from '../app.component'
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastController } from '@ionic/angular';
import * as $ from 'jquery';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { CalendarComponentOptions } from 'ion2-calendar';
import { NotificationPage } from '../notification/notification.page';

@Component({
  selector: 'app-worker-management',
  templateUrl: './worker-management.page.html',
  styleUrls: ['./worker-management.page.scss'],
})
export class WorkerManagementPage implements OnInit {

	worker:any
	society:any
	drop_down_inactive: any;
	drop_down_select: any;
	noti_count: any;
	worker_details_hide=0; 
	user_details:any;
	all_socity_selected:any;
	worker_listing=[];
	filter_Data_return:any
	date_range:any
	current_Date:any
	page=1
	date_clndr=false
	date_clndr2=false
	updatePopup=false
	dateRange= new Date();
	dateRange2= new Date();
	s_date:any;
	e_date:any;
	time_in_fill:any;
	time_in
	time_out
	worker_id
	job_date
	attendence_id
	workerlistinglength
	start_date = new Date()
	end_date = new Date()
	optionsRange: CalendarComponentOptions = {
		pickMode: 'single',
		from: new Date(2010, 1, 1),
  		to: new Date(Date.now() + 24 * 60 * 60 * 1000 * 90),
	};
	optionsRange2: CalendarComponentOptions = {
		pickMode: 'single',
		from: new Date(2010, 1, 1),
  		to: new Date(Date.now() + 24 * 60 * 60 * 1000 * 90),
	};

	constructor(
		private router : Router, 
		private globleServiceService:GlobleServiceService,
		private storage:Storage,
		public alertController:AlertController,
		public events: Events,
		private appComponent:AppComponent,
		private spinner: NgxSpinnerService,
		private routers:ActivatedRoute,
		public toastController: ToastController,
		private modalController : ModalController,
	) {}

	ngOnInit() {}

	ionViewWillEnter(){
		this.worker_list()
	}

	// worker list show
	worker_list(){
		this.spinner.show()
		this.current_Date = moment(this.current_Date).format('YYYY-MM-DD')
		this.storage.get('user_details').then((val) => {
			this.user_details = val;
			this.weellCount()
			let key = {
				apikey:this.globleServiceService.apikey,
				user_id:this.user_details.user_id,
				access_token:this.user_details.access_token,
				society_id:this.user_details.society,
				page:'1',
				e_date:this.e_date,
				s_date:this.s_date,
			}
			this.globleServiceService.GlobalHit(key,'list_worker').
			then(async data=>{
				this.spinner.hide()
				if(data['worker_list'].data!=null){
					this.worker_details_hide=1
					this.worker_listing=this.worker_listing.concat(data['worker_list'].data)
				}else{
					this.worker_details_hide=2
				}
			})
		});
	}

	// Add worker page open
	addWorker(){
		this.router.navigateByUrl('/add-worker')	
	}

	loadData(event) {
		this.page = this.page+1
		this.worker_list_infinite()
		setTimeout(() => {
			event.target.complete();
				if (this.worker_listing.length > this.workerlistinglength) {
					event.target.disabled = true;
				}
		}, 500);
	}

	PresentApsent(vls,id,clock_in,clock_out){
		this.time_in=undefined
		this.time_out=undefined
		$('.remove_yes_no').each(function(){
			if($(this).attr("name")==id && vls=='Yes'){
				var lang = $(this).attr("name");
				var lang2 = lang+'_1';
				$("."+lang2).prop('checked', true);
			}else{
				var lan3 = $(this).attr("name");
				var lang4 = lan3+'_2';
				var myId=$(this).attr("id");	
				if($( "#"+myId ).hasClass( "open_box" )){
					// nothing
				}else{
					$("."+lang4).prop('checked', true);
				}
			}
		});
		$('.remove_input_box').each(function(){
			if($(this).attr("id")=='icon_right_true_'+id){
				if(vls=='Yes'){
					$('#icon_right_true_'+id).css('display','block');
				}else{
					var myId=$(this).attr("id");
					if($( "#"+myId ).hasClass( "open_box" )){
						$('#'+myId).css('display','block');
					}else{
						$('#'+myId).css('display','none');
					}
				}
			}else{
				var myId=$(this).attr("id");				
				if($( "#"+myId ).hasClass( "open_box" )){
					$('#'+myId).css('display','block');
				}else{
					$('#'+myId).css('display','none');
				}
			}
		});
	}

	worker_list_infinite(){
		this.current_Date = moment(this.current_Date).format('YYYY-MM-DD')
		this.storage.get('user_details').then((val) => {
			this.user_details = val;
			let key = {
				apikey:this.globleServiceService.apikey,
				user_id:this.user_details.user_id,
				access_token:this.user_details.access_token,
				society_id:this.user_details.society,
				page:this.page,
				e_date:this.e_date,
				s_date:this.s_date,
			}
			this.globleServiceService.GlobalHit(key,'list_worker').
			then(async data=>{
				if(data['worker_list'].data!=null){
					this.worker_details_hide=1
					this.worker_listing=this.worker_listing.concat(data['worker_list'].data)
				}
			})
		});
	}

	openModelHide(){
		this.date_clndr=false
		this.date_clndr2=false
		this.updatePopup=false
	}

	back(){
		this.storage.remove('filter_value')
	}

	startDate(){
		this.date_clndr=true
	}
	endDate(){
		this.date_clndr2=true
	}

	dateFilter2(vls){
		this.end_date=vls
		this.date_clndr2=false
	}

	dateFilter(vls){
		this.start_date=vls
		this.date_clndr=false
	}
	
	async apply(){
		if(this.dateRange!=undefined && this.dateRange2!=undefined){
			var Difference_In_Time = this.end_date.getTime() - this.start_date.getTime(); 
			var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
			if(Difference_In_Days > 7){
				this.alertMsg('Please select filter list range only 1 week')
			}else if(new Date(this.start_date) > new Date(this.end_date)){
				this.alertMsg('Select End Date greater than Start Date')
			}else{
				this.s_date=moment(this.start_date).format('YYYY-MM-DD')
				this.e_date=moment(this.end_date).format('YYYY-MM-DD')
				this.worker_list_filter()
			}
		}else if(this.dateRange==undefined){
			this.alertMsg('Please select start date')
		}else if(this.dateRange2==undefined){
			this.alertMsg('Please select end date')
		}else{
			this.alertMsg('Please select date')
		}
	}

	worker_list_filter(){
		this.spinner.show()
		this.worker_listing=[]
		this.page=1
		this.current_Date = new Date()
		this.current_Date = moment(this.current_Date).format('YYYY-MM-DD')
		this.storage.get('user_details').then((val) => {
			this.user_details = val;
			let key = {
				apikey:this.globleServiceService.apikey,
				user_id:this.user_details.user_id,
				access_token:this.user_details.access_token,
				society_id:this.user_details.society,
				page:this.page,
				e_date:this.e_date,
				s_date:this.s_date,
			}
			this.globleServiceService.GlobalHit(key,'list_worker').
			then(async data=>{
				this.spinner.hide()
				if(data['worker_list'].data!=null){
					this.worker_details_hide=1
					this.worker_listing=this.worker_listing.concat(data['worker_list'].data)
				}else{
					this.worker_details_hide=2
				}
			})
		});
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

	async alertMsgsuccessCls(error_msg_show){
		const toast = await this.toastController.create({
			message: error_msg_show,
			color: 'primary',
			position:'bottom',
			duration: 2000,
		});
		toast.present();
	}

	setIntime(value){
		this.time_in=value
	}

	setOuttime(value){
		this.time_out=value
	}

	timeIn(worker_id,job_date){
		console.log(this.time_in)
		var preg_match = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;
		if(this.time_in.match(preg_match)){
			if(this.current_Date==job_date){
				this.spinner.show()
				let key={
					apikey:this.globleServiceService.apikey,
					attendence_status:1,
					worker_id:worker_id,
					time_in:this.time_in,
					time_out:this.time_out,
					attendence_for_date:job_date,
				}
				this.globleServiceService.GlobalHit(key,'add_attendence').
				then(data=>{
					this.spinner.hide()
					if(data['responseCode']==200){
						this.worker_listing=[]
						this.page=1
						this.alertMsgsuccess(data['message'])
						this.worker_list()
					}else{
						this.alertMsg(data['message'])
					}
				});
			}else{
				this.pastDateAttendence(worker_id,job_date)
			}
		}else{
			this.alertMsg('Please enter valid time.eg:12:15')
		}
	}

	timeOut(worker_id,job_date){
		var preg_match = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;
		if(this.time_out.match(preg_match)){
			if(this.current_Date==job_date){
				this.spinner.show()
				// var new_time =new Date(this.time_out);
				// this.time_out=new_time.getHours() + ":" + new_time.getMinutes()
				let key={
					apikey:this.globleServiceService.apikey,
					attendence_status:1,
					worker_id:worker_id,
					time_in:this.time_in,
					time_out:this.time_out,
					attendence_for_date:job_date,
				}
				this.globleServiceService.GlobalHit(key,'add_attendence').
				then(data=>{
					this.spinner.hide()
					if(data['responseCode']==200){
						this.worker_listing=[]
						this.page=1
						this.worker_list()
						this.alertMsgsuccess(data['message'])
					}else{
						this.alertMsg(data['message'])
					}
				});
			}else{
				this.pastDateAttendence(worker_id,job_date)
			}
		}else{
			this.alertMsg('Please enter valid time.eg:12:15')
		}
	}

	pastDateAttendence(worker_id,job_date){
		if(this.time_in!=undefined && this.time_out!=undefined && this.time_in!="" && this.time_out!=""){
		/////////////////////////////////////////
		var preg_match = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;
		var preg_match1 = /^([01]\d|2[0-3]):?([0-5]\d)$/;
		var chek_time_in_hh:any
		var chek_time_out_hh:any
		var chek_time_in_mm:any
		var chek_time_out_mm:any
		var chek_time_in = this.time_in.split(':');
		var chek_time_out = this.time_out.split(':');
		var in_time_length=chek_time_in[0].length
		var out_time_length=chek_time_out[0].length
		chek_time_in_hh = parseInt(chek_time_in[0])
		chek_time_out_hh = parseInt(chek_time_out[0])
		chek_time_in_mm = parseInt(chek_time_in[1])
		chek_time_out_mm = parseInt(chek_time_out[1])
		if(chek_time_in_hh<10){
			chek_time_in_hh = '0'+chek_time_in_hh
		}
		if(chek_time_out_hh<10){
			chek_time_out_hh = '0'+chek_time_out_hh
		}
		if(chek_time_in_mm<10){
			chek_time_in_mm = '0'+chek_time_in_mm
		}
		if(chek_time_out_mm<10){
			chek_time_out_mm = '0'+chek_time_out_mm
		}
		var new_chek_in_time = chek_time_in_hh+':'+chek_time_in_mm;
		var new_chek_out_time = chek_time_out_hh+':'+chek_time_out_mm;
		if(new_chek_out_time==undefined){
			this.alertMsg('Please select time out')
		}else if(in_time_length>2 ||out_time_length>2){
			this.alertMsg('Please enter valid time.eg:12:15')
		}else if(chek_time_in_mm.length>2 ||chek_time_out_mm.length>2){
			this.alertMsg('Please enter valid time.eg:12:15')
		}else if(!new_chek_in_time.match(preg_match)){
			this.alertMsg('Please enter valid time.eg:12:15')
		}else if(!new_chek_out_time.match(preg_match)){
			this.alertMsg('Please enter valid time.eg:12:15')
		}else if(!new_chek_in_time.match(preg_match1)){
			this.alertMsg('Please enter valid time.eg:12:15')
		}else if(new_chek_out_time<new_chek_in_time){
			this.alertMsg('Time out should be greater than time In.')
		}else if(!new_chek_out_time.match(preg_match1)){
			this.alertMsg('Please enter valid time.eg:12:15')
		}else{
		/////////////////////////////////////////
			// var preg_match1 = /^([01]\d|2[0-3]):?([0-5]\d)$/;
			// if (this.time_in > this.time_out){
			// 	this.alertMsg('Time out should be greater than time In.')
			// }else if(!this.time_out.match(preg_match1)){
			// 	console.log('this.time_out')
			// 	console.log(this.time_out)
			// 	this.alertMsg('Please enter valid time.eg:12:15')
			// }else if(!this.time_in.match(preg_match1)){
			// 	console.log('this.time_in')
			// 	console.log(this.time_in)
			// 	this.alertMsg('Please enter valid time.eg:12:15')
			// }else{
		///////////////////////////////////////
				this.spinner.show()
				let key={
					apikey:this.globleServiceService.apikey,
					attendence_status:1,
					worker_id:worker_id,
					time_in:this.time_in,
					time_out:this.time_out,
					attendence_for_date:job_date,
				}
				this.globleServiceService.GlobalHit(key,'add_attendence').
				then(data=>{
					if(data['responseCode']==200){
						this.alertMsgsuccess(data['message'])
						setTimeout(() => {
							this.worker_listing=[]
							this.page=1
							this.worker_list()
						}, 500);
					}else{
						this.alertMsg(data['message'])
					}
				});
			}
		}else{
			if(this.time_in==undefined){
				this.alertMsg("Please select time in")
			}else{
				this.alertMsg("Please select time Out")
			}
		}
	}

	Update(id,time_in,job_date,attendence_id,time_out){
		this.time_in=time_in
		this.time_out=time_out
		this.worker_id=id
		this.job_date=job_date
		this.attendence_id=attendence_id
		this.updatePopup=true
	}

	timeInPopup(vls){
		this.time_in=vls
	}

	timeOutPopup(vls){
		this.time_out=vls
	}

	submit(){
		var preg_match = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;
		var preg_match1 = /^([01]\d|2[0-3]):?([0-5]\d)$/;
		var chek_time_in_hh:any
		var chek_time_out_hh:any
		var chek_time_in_mm:any
		var chek_time_out_mm:any
		var chek_time_in = this.time_in.split(':');
		var chek_time_out = this.time_out.split(':');
		var in_time_length=chek_time_in[0].length
		var out_time_length=chek_time_out[0].length
		chek_time_in_hh = parseInt(chek_time_in[0])
		chek_time_out_hh = parseInt(chek_time_out[0])
		chek_time_in_mm = parseInt(chek_time_in[1])
		chek_time_out_mm = parseInt(chek_time_out[1])
		if(chek_time_in_hh<10){
			chek_time_in_hh = '0'+chek_time_in_hh
		}
		if(chek_time_out_hh<10){
			chek_time_out_hh = '0'+chek_time_out_hh
		}
		if(chek_time_in_mm<10){
			chek_time_in_mm = '0'+chek_time_in_mm
		}
		if(chek_time_out_mm<10){
			chek_time_out_mm = '0'+chek_time_out_mm
		}
		var new_chek_in_time = chek_time_in_hh+':'+chek_time_in_mm;
		var new_chek_out_time = chek_time_out_hh+':'+chek_time_out_mm;
		if(new_chek_out_time==undefined){
			this.alertMsg('Please select time out')
		}else if(in_time_length>2 ||out_time_length>2){
			this.alertMsg('Please enter valid time.eg:12:15')
		}else if(chek_time_in_mm.length>2 ||chek_time_out_mm.length>2){
			this.alertMsg('Please enter valid time.eg:12:15')
		}else if(!new_chek_in_time.match(preg_match)){
			this.alertMsg('Please enter valid time.eg:12:15')
		}else if(!new_chek_out_time.match(preg_match)){
			this.alertMsg('Please enter valid time.eg:12:15')
		}else if(!new_chek_in_time.match(preg_match1)){
			this.alertMsg('Please enter valid time.eg:12:15')
		}else if(new_chek_out_time<new_chek_in_time){
			this.alertMsg('Time out should be greater than time In.')
		}else if(!new_chek_out_time.match(preg_match1)){
			this.alertMsg('Please enter valid time.eg:12:15')
		}else{
			this.page=1
			this.spinner.show()
			let key={
				apikey:this.globleServiceService.apikey,
				attendence_status:1,
				worker_id:this.worker_id,
				time_in:new_chek_in_time,
				time_out:new_chek_out_time,
				attendence_for_date:this.job_date,
				attendence_id:this.attendence_id,
			}
			this.globleServiceService.GlobalHit(key,'update_attendence').
			then(data=>{
				this.spinner.hide()
				if(data['responseCode']==200){
					this.updatePopup=false
					this.worker_listing=[]
					this.worker_list()
					this.alertMsgsuccess(data['message'])
				}else{
					this.alertMsg(data['message'])
				}
			});
		}
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
