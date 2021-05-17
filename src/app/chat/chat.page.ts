import { Component, OnInit } from '@angular/core';
import {GlobleServiceService} from '../globle-service.service'
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AlertController, Events, MenuController, Platform } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastController } from '@ionic/angular';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { last } from '@angular/router/src/utils/collection';
import * as $ from 'jquery';
import { DocumentViewer,DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer} from '@ionic-native/file-transfer/ngx';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
//import { interval, Subscription,Observable } from 'rxjs/Rx';
;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  user_details:any;
  recieve_lastid:any;
  ticket_id:any;
  get_msg:any;
  get_msg2:any;
  message:any;
	baseUrlImage="https://ejobshire.com/baywash/assets_modern_admin/baywash/ticket/"
	baseUrlImage2="https://ejobshire.com/baywash/assets_modern_admin/baywash/ticket/"
  imageZoom=false
  imageZoomdata
  insuranceFile
  image
  scrollValue = 0

  constructor(
    private router : Router, 
		private globleServiceService:GlobleServiceService,
		private storage:Storage,
		public alertController:AlertController,
		public events: Events,
		private spinner: NgxSpinnerService,
		private routers:ActivatedRoute,
    private toastController:ToastController,
    private fileChooser: FileChooser,
		private filePath: FilePath,
    private base64:Base64,
    private documentViewer: DocumentViewer,
    private platform: Platform,
    private file: File,
    private transfer: FileTransfer,
    private previewAnyFile: PreviewAnyFile,
   
  ) {
    this.ticket_id=this.routers.snapshot.params['id']
   }

  ngOnInit() {}

  ionViewWillEnter(){
    this.storage.get('user_details').then((val) => {
      this.user_details = val;
      this.getTicketMessageChat();
      setTimeout(
        function() 
        {
          $("main").last()[0].scrollIntoView({ behavior: 'smooth' });
        }, 1000);
    });
  }


  getTicketMessageChat(){
			let key = {
				apikey:this.globleServiceService.apikey,
				ticket_id:this.ticket_id,
			}
			this.globleServiceService.GlobalHit(key,'get_ticket_message_chat').
			then(async data=>{
        this.get_msg=data['data'];
        this.recieve_lastid=data['last_id'];
        setInterval(() => {
         this.getChatInId();
        }, 10000);
			})
  }
  
  submit(){
    if(this.message!=undefined && this.message!=''){
      let key = {
        apikey:this.globleServiceService.apikey,
        ticket_id:this.ticket_id,
        sender:this.user_details.user_id,
        receiver:'8824',
        content:this.message,
      }
      this.globleServiceService.GlobalHit(key,'insert_chat').
      then(async data=>{
        this.scrollValue=0
        this.message=''
        if(this.recieve_lastid!=null){
          this.getChatInId()
        }else{
          this.getTicketMessageChat()
        }
        if(this.recieve_lastid!=null){
          setTimeout(() => {
            $("main").last()[0].scrollIntoView({behavior: "instant" , block: "end"});
          }, 800);
        }
      })
    }
  }

  getChatInId(){
    let key = {
      apikey:this.globleServiceService.apikey,
      ticket_id:this.ticket_id,
      last_id:this.recieve_lastid,
    }
    this.globleServiceService.GlobalHit(key,'latest_message_chat').
    then(async data=>{
    this.get_msg2=data['data'];
    if(data['last_id']!=null){
      this.recieve_lastid=data['last_id'];
    }
    if(this.get_msg2.length>0){
      this.get_msg2.forEach(item => {
          this.get_msg.push(item);
        });
      }
      if(this.scrollValue==0){
        $("main").last()[0].scrollIntoView({behavior: "instant" , block: "end"});
        this.scrollValue=1
      }
    })
  }

  allPage(){
    this.getTicketMessageChat()
  }

  insuranceFileUploade(){
    var validExtensions = ['jpg','gif','pdf','docx', 'png', 'jpeg', 'document', 'doc', 'plain', 'gif']; 
		this.fileChooser.open().then((fileuri)=>{
			this.filePath.resolveNativePath(fileuri).then(
			  async (resolveNativePath)=>{
        this.insuranceFile = resolveNativePath;
        var fileName = this.insuranceFile;
        var fileNameExt = fileName.substr(fileName.lastIndexOf('.') + 1);
        if ($.inArray(fileNameExt, validExtensions) == -1){
            const toast = await this.toastController.create({
              message: 'Invalid file type',
              color: 'danger',
              position:'bottom',
              duration: 2000,
            });
            toast.present();
            return false;
        }else{
          this.base64.encodeFile(this.insuranceFile).then((toBase64String)=>{
            this.image=toBase64String
            // this.image='data:image/png;base64,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'
            this.spinner.show()
            let key = {
              apikey:this.globleServiceService.apikey,
              ticket_id:this.ticket_id,
              sender:this.user_details.user_id,
              receiver:'8824',
              content:'',
              attachment_file:this.image
            }
            this.globleServiceService.GlobalHit(key,'insert_chat').
            then(async data=>{
              this.message=''
              this.getTicketMessageChat()
            })
          })
        }
			})
		})
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

}


