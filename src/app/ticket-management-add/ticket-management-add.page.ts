import { Component, OnInit } from '@angular/core';
import { NavController,AlertController,ActionSheetController, ToastController,Platform } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import {GlobleServiceService} from '../globle-service.service'
import { AppComponent } from '../app.component'
import { NgxSpinnerService } from 'ngx-spinner';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer} from '@ionic-native/file-transfer/ngx';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { DocumentViewer,DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import * as $ from 'jquery';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-ticket-management-add',
  templateUrl: './ticket-management-add.page.html',
  styleUrls: ['./ticket-management-add.page.scss'],
})
export class TicketManagementAddPage implements OnInit {

	ticket_add: FormGroup;
	ticket = {
		title:"",
		descripion:"",
		priority:"",
		customer:undefined,
		flat:"",
		tower:"",
		worker:undefined,
		society:"",
		status:"2",
		tickett_ype:"",
	};
	user_details:any;
	worker_list:any;
	customers_listing:any;
	documents:any;
	fileArray:any=[]
	imageArrayShowOnly:any=[]
	image:any
	imageZoom=false
	imageZoomdata
	baseUrlImage="https://ejobshire.com/baywash/assets_modern_admin/car_gallery/"
	society_listing:any
	setCustomer:any
	worker_Id_get:any
	customer_name_field=true
	workerListHide=true;
	ticket_custome_list=true;
	customer_filter:any
	type_custumer=0
	type_worker=0
	value_type

	constructor(
		private router : Router,
		public toastController:ToastController, 
		private storage:Storage,
		private routers:ActivatedRoute,
		public alertController:AlertController,
		private globleServiceService:GlobleServiceService,
		private appComponent:AppComponent,
		private spinner: NgxSpinnerService,
		private fileChooser: FileChooser,
		private filePath: FilePath,
		private documentViewer: DocumentViewer,
		private platform: Platform,
		private file: File,
		private transfer: FileTransfer,
		private previewAnyFile: PreviewAnyFile,
		private base64:Base64,
		private keyboard: Keyboard
	) {
		this.ticket_add = new FormGroup({
			title: new FormControl('', [Validators.required]),
			customer: new FormControl(),
			descripion: new FormControl(),
			priority: new FormControl(),
			flat: new FormControl(),
			tower: new FormControl(),
			worker: new FormControl(),
			society: new FormControl(),
			status: new FormControl(),
			tickett_ype: new FormControl('', [Validators.required]),
		})
	}

	ngOnInit() {
		this.storage.get('user_details').then((val) => {
			this.user_details = val;
			this.ticket.society=val.society_name
			this.selectWorker()
			this.societyListing()
			this.customer_list()
		})
		$(document).ready(function($) {
			$('.ioninput').keyup(function(event) {
				var textBox = event.target;
				var start = textBox.selectionStart;
				var end = textBox.selectionEnd;
				textBox.value = textBox.value.charAt(0).toUpperCase() + textBox.value.slice(1).toLowerCase();
				textBox.setSelectionRange(start, end);
			});

			// $("#focusinput").focusin(function(){
			// 	$("#focusSelect").css({"visibility":"visible", "opacity":"1", "display":"block"});
			// 	$(".selec_society_div").addClass('box_top_');
			// 	this.keyboard.hide()
			// })
			// $("#focusinput").click(function(){
			// 	$("#focusSelect").css({"visibility":"visible", "opacity":"1", "display":"block"});
			// 	$(".selec_society_div").addClass('box_top_');
			// })
			// $("#focusinput").focusout(() =>{
			// 	// this.keyboard.disableScroll(true);
			// })

			
			// $("#focusinput1").focusin(function(){
			// 	$("#focusSelect1").css({"visibility":"visible", "opacity":"1", "display":"block"});
			// 	$(".selec_society_div").addClass('box_top_');
			// 	// this.keyboard.disableScroll(false);
			// })
			// $("#focusinput1").click(function(){
			// 	$("#focusSelect1").css({"visibility":"visible", "opacity":"1", "display":"block"});
			// 	$(".selec_society_div").addClass('box_top_');
			// })
			

		});
	}

	ionViewWillEnter(){}

	// focusset(){
	// 	$(document).ready(function($) {
	// 		$('#focusSelect').css({"visibility":"hidden", "opacity":"0", "display":"none"});
	// 		$('#focusSelect1').css({"visibility":"hidden", "opacity":"0", "display":"none"});
	// 	})
	// }
	
	// user Add details and call api
	ticketData(){
		if(this.value_type=='1'){
			if(this.type_custumer ==1){
				if(this.setCustomer=='' || this.setCustomer==null || this.setCustomer==undefined){
					this.alertMsg('Please select register customer.')
				}else{
					this.addTicketnew()
				}
			}else if(this.type_worker==1){
				if(this.worker_Id_get=='' || this.worker_Id_get==null || this.worker_Id_get==undefined || this.worker_Id_get=='undefined'){
					this.alertMsg('Please select register worker.')
				}else{
					this.addTicketnew()
				}
			}else{
				this.addTicketnew()
			}
		}else{
			if(this.type_worker==1){
				if(this.worker_Id_get=='' || this.worker_Id_get==null || this.worker_Id_get==undefined || this.worker_Id_get=='undefined'){
					this.alertMsg('Please select register worker.')
				}else{
					this.addTicketnew()
				}
			}else{
				this.addTicketnew()
			}
		}	

	}

	addTicketnew(){
		this.spinner.show()
		this.storage.get('user_details').then((val) => {
			this.user_details = val;
			let key = {
				apikey:	this.globleServiceService.apikey,
				user_id:this.user_details.user_id,
				customer_id:this.setCustomer,
				ticket_title:this.ticket.title,
				description:this.ticket.descripion,
				priority:this.ticket.priority,
				flat:this.ticket.flat,
				tower:this.ticket.tower,
				worker_id:this.worker_Id_get,
				status:	this.ticket.status,
				society_id:this.user_details.society,
				ticket_type:this.ticket.tickett_ype,
				attachment:this.fileArray
			}
			console.log()

			this.globleServiceService.GlobalHit(key,'add_ticket').
			then(async data=>{
				this.spinner.hide()
				if(data['responseCode']=='200'){
					const toast = await this.toastController.create({
						message: 'Ticket created successfully',
						duration: 3000,
						color:'success',
						position:'bottom'
					});
					toast.present();
					this.ticket_add.reset()
					this.router.navigateByUrl('/ticket-management')
					this.ticket_custome_list=true;
					this.workerListHide=true;
					this.setCustomer=undefined
					this.worker_Id_get=undefined
				}else if(data['responseCode']=='202'){
					const toast = await this.toastController.create({
						message: 'Do not submit your ticket',
						duration: 3000,
						color:'dark',
						position:'bottom'
					});
					toast.present();
				}
			})
		});
	}

	// statusId
	// userStatus(id,value){
	// 	this.ticket.status= value
	// 	this.statusId=id
	// 	$(document).ready(function($) {
	// 		$("#focusSelect1").css({"visibility":"hidden", "opacity":"0", "display":"none"});
	// 	})
	// }

	// priorityId
	// prioritySelect(id,value){
	// 	this.ticket.priority= value
	// 	this.priorityId=id
	// 	$(document).ready(function($) {
	// 		$("#focusSelect").css({"visibility":"hidden", "opacity":"0", "display":"none"});
	// 	})
	// }

	userStatus(value){
		this.ticket.status= value
	}

	priority(value){
		this.ticket.priority= value
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

	customer_list(){
		this.storage.get('user_details').then((val) => {
		this.user_details = val;
		this.spinner.show()
			let key = {
				apikey:this.globleServiceService.apikey,
				user_id:this.user_details.user_id,
				access_token:this.user_details.access_token,
				society_id:this.user_details.society,
				customer_type:'',
				search:''
			}
			this.globleServiceService.GlobalGetHit(key,'customer_list').
			then(async data=>{
				this.spinner.hide()
				this.customers_listing=data['customer_list'].customer_list;
			})
		});
	}

	customerGet(id,fname,lname){
		this.ticket.customer = fname+' '+lname
		this.setCustomer = id
		this.type_custumer=0
		this.flatAndTower(id)
	}

	flatAndTower(id){
		let key = {apikey:this.globleServiceService.apikey,customer_id:id,}
		this.globleServiceService.GlobalHit(key,'flat_tower').
		then(data=>{
			this.ticket.tower=data['flat_tower'].tower
			this.ticket.flat=data['flat_tower'].flat
		})
	}

	DockFileUploade(){
		this.fileChooser.open().then((fileuri)=>{
			this.filePath.resolveNativePath(fileuri).then(
			(resolveNativePath)=>{
				this.base64.encodeFile(resolveNativePath).then((toBase64String)=>{
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
							this.alertMsg('File size should not more than 2MB.')
						}else if(dataImage.extension_status==false || dataImage.extension_status=='false'){
							this.alertMsg('Please upload allowed type of file ( pdf, doc, docx, jpg, jpeg, gif, png) only.')
						}else{
							this.fileArray.push(toBase64String)
							this.imageArrayShowOnly.push(dataImage);
						}
					})
				})
			})
		})
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

	openModel(baseUrlImage,docmtId_proof){
		this.imageZoom=true
		this.imageZoomdata=baseUrlImage + docmtId_proof
	}

	popupCancel(){
		this.imageZoom=false
	}

	pdfView(baseUrlImage,docmt,extension){
		if(extension=='pdf'){
			let path = null;
			if(this.platform.is('ios')){
				path = this.file.documentsDirectory;
			}else{
				path = this.file.dataDirectory;
			}
			const transfer = this.transfer.create()
			transfer.download(baseUrlImage+docmt,path+'myfile.pdf').then(entry =>{
				let url = entry.toURL()
				this.documentViewer.viewDocument(url, 'application/pdf', {});
			})		  
		}else{
			var url = baseUrlImage+docmt
			this.previewAnyFile.preview(url).then(()=>{},(err)=>{})
		}
	}

	removeImage(i){
		this.fileArray.splice(i, 1);
		this.imageArrayShowOnly.splice(i, 1);
	}


	societyListing(){
		let key = {
			apikey:this.globleServiceService.apikey,
		}
		this.globleServiceService.GlobalHit(key,'get_society').
		then(async data=>{
			this.society_listing=data['society_list'].socity
		})
	}

	tickettType(value){
		this.value_type = value
		if(value=='2'){
			this.customer_name_field = false
		}else{
			this.customer_name_field = true
		}
	}

	workerFnc(vls){
		if(vls!=''){
			this.type_worker=1
		}else{
			this.type_worker=0
		}
		this.workerListHide=false;
	}

	getWorkerGet(id,workerName){
		this.ticket.worker=workerName
		this.worker_Id_get=id
		this.type_worker=0
		this.workerListHide=true;
	}
	
	ticketCustomeList(vls){
		if(vls!=''){
			this.type_custumer=1
		}else{
			this.type_custumer=0
		}
		this.ticket_custome_list=false;
	}

}
