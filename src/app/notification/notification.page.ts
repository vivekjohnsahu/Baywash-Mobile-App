import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {GlobleServiceService} from '../globle-service.service'
import { Storage } from '@ionic/storage';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

  noti_text:any;
  skeleton=1

  constructor(
    private view:ModalController,
    private storage:Storage,
    private spinner: NgxSpinnerService,
    private router: Router,
    private globleServiceService:GlobleServiceService,) { }

  ngOnInit() {
  }

  closeModel(){
    this.view.dismiss()
  }

  ionViewWillEnter(){
    this.notification()
  }

  notification(){
    this.storage.get('user_details').then((val) => {
        let key={
            user_id :val.user_id,
            society :val.society,
            apikey:this.globleServiceService.apikey,
        }
        this.globleServiceService.GlobalHit(key,'notification').
        then(data=>{
            if(data['notification']!=null){
              this.skeleton=2
              this.noti_text=data['notification']
            }else{
              this.skeleton=3
            }
        })
    })
  }

  ticketView(ticket_id,type){
    this.view.dismiss()
    if(type==2 || type==1){
      this.router.navigateByUrl('/ticket-details/'+ticket_id)
    }else{
      this.router.navigateByUrl('/chat/'+ticket_id)
    }

  }

}
