import { Component, OnInit } from '@angular/core';
import {GlobleServiceService} from '../globle-service.service'
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AlertController, MenuController, Platform } from '@ionic/angular';
import { AppComponent } from '../app.component'
import { NgxSpinnerService } from 'ngx-spinner';
import { DocumentViewer,DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer} from '@ionic-native/file-transfer/ngx';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { ModalController } from '@ionic/angular';
import { NotificationPage } from '../notification/notification.page';
import { Events} from '@ionic/angular';

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.page.html',
  styleUrls: ['./car-details.page.scss'],
})
export class CarDetailsPage implements OnInit {

	document: any[];
	worker:any
	society:any
	drop_down_inactive: any;
	drop_down_select: any;
	car_details_hide=1; 
	user_details:any;
	all_socity_selected:any;
	car_id:any;
	car_data: any;
	car_docx: any;
	car_type: any;
	cmt_id: any;
	abc: any;
	baseUrlImage: any;
	abcd=1
	imageZoom=false
	edit_btn_container=true
	noti_count=true
	imageZoomdata

	constructor(
		private router : Router, 
			private globleServiceService:GlobleServiceService,
			private storage:Storage,
			public alertController:AlertController,
			public events: Events,
			private appComponent:AppComponent,
			private spinner: NgxSpinnerService,
			private routers:ActivatedRoute,
			private documentViewer: DocumentViewer,
			private platform: Platform,
			private file: File,
			private transfer: FileTransfer,
			private previewAnyFile: PreviewAnyFile,
			private modalController: ModalController
	) {
		this.car_id = this.routers.snapshot.params['id']
		this.car_type = this.routers.snapshot.params['type']
		this.cmt_id = this.routers.snapshot.params['cmt_id']
		this.baseUrlImage="https://ejobshire.com/baywash/assets_modern_admin/car_gallery/"
	}

	ngOnInit() {}

	ionViewWillEnter(){
		this.car_list()
	}

	car_list(){
		if(this.car_type==2){
			this.spinner.show()
			this.car_details_hide=1
			this.storage.get('user_details').then((val) => {
			this.user_details = val;
			this.weellCount()
			let key = {
				apikey:this.globleServiceService.apikey,
				car_id: this.car_id
			}
			this.globleServiceService.GlobalHit(key,'view_car').
				then(async data=>{
				this.car_data=data['customer_list'].car_details.car_detail;
				this.car_docx=data['customer_list'].car_details.car_docx;
				this.abcd=2
				this.abc = this.car_data.number_of_time_provide_service_in_week.split(",");
				})
			});
			this.spinner.hide()
		}else{
			this.spinner.show()
			this.car_details_hide=1
			this.storage.get('user_details').then((val) => {
			this.user_details = val;
			let key = {
				apikey:this.globleServiceService.apikey,
				car_id: this.car_id
			}
			this.globleServiceService.GlobalHit(key,'view_guest_car').
				then(async data=>{
					this.abcd=1
					this.car_data=data['customer_list'].car_details.guest_car_detail;
					this.car_docx=[];
				})
			});
			this.spinner.hide()
		}
	}

	edit_car(id){
		this.storage.set('urlSaveCmt',this.cmt_id)
		this.router.navigateByUrl('/add-car' +'/'+ 'edit' +'/'+ this.car_type +'/'+ id)
	}

	back(){
		this.router.navigateByUrl('/customer-details/' + this.cmt_id +'/'+this.car_type)
	}

	openModel(baseUrlImage,docmtId_proof){
		this.imageZoom=true
		this.imageZoomdata=baseUrlImage + docmtId_proof
		this.edit_btn_container=false
	}

	popupCancel(){
		this.imageZoom=false
		this.edit_btn_container=true
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
