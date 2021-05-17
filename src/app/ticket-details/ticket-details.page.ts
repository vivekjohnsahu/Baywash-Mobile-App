import { Component, OnInit } from '@angular/core';
import {GlobleServiceService} from '../globle-service.service'
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AlertController, Events, MenuController, Platform } from '@ionic/angular';
import { AppComponent } from '../app.component'
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastController } from '@ionic/angular';
import { Socket } from 'ng-socket-io';
import { DocumentViewer,DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer} from '@ionic-native/file-transfer/ngx';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { NotificationPage } from '../notification/notification.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.page.html',
  styleUrls: ['./ticket-details.page.scss'],
})
export class TicketDetailsPage implements OnInit {

	ticket_id:any
	user_details:any;
	ticket:any;
	noti_count:any;
	ticket_comments:any;
	imageZoom=false
	imageZoomdata
	baseUrlImage="https://ejobshire.com/baywash/assets_modern_admin/car_gallery/"
	car_docx: any;

	constructor(
		private router : Router, 
		private globleServiceService:GlobleServiceService,
		private storage:Storage,
		public alertController:AlertController,
		public events: Events,
		private appComponent:AppComponent,
		private spinner: NgxSpinnerService,
		private routers:ActivatedRoute,
		private toastController:ToastController,
		private documentViewer: DocumentViewer,
		private platform: Platform,
		private file: File,
		private transfer: FileTransfer,
		private previewAnyFile: PreviewAnyFile,
		private modalController: ModalController,
	) {
		this.ticket_id=this.routers.snapshot.params['id']
	}

	ngOnInit() {
	}

	ionViewWillEnter(){
    	this.ticket_management_details()
	}

	// Ticket single list 
	ticket_management_details(){
		this.spinner.show()
		this.storage.get('user_details').then((val) => {
		this.user_details = val;
			let key = {
				apikey:this.globleServiceService.apikey,
				id:this.ticket_id
			}
			this.globleServiceService.GlobalHit(key,'ticket_view').
			then(async data=>{
				this.spinner.hide()
				this.ticket=data['ticket_view'].ticket_data
				this.car_docx=data['ticket_view'].ticket_attachment
				this.ticket_comments=data['ticket_view'].ticket_comments
				this.ticket = new Array(this.ticket);
			})
		});
	}

	// chating page move
	chatingPage(id){
		this.router.navigateByUrl('/chat'+'/'+id)	
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
