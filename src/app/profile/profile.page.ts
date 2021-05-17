import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NgxSpinnerService } from 'ngx-spinner';
import {GlobleServiceService} from '../globle-service.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user_details:any;
  userData:any;
  image_url:any;

  constructor(
    public storage: Storage,
		public globleServiceService: GlobleServiceService,
		private spinner: NgxSpinnerService,
  ) { 

    this.image_url = this.globleServiceService.BaseUrl_image
  }

  ngOnInit() {
    this.user_data()
  }

  user_data(){
    this.spinner.show()
    this.storage.get('user_details').then((val) => {
      this.user_details = val;
      let key={
        user_id:this.user_details.user_id,
        apikey:this.globleServiceService.apikey,
      }
      this.globleServiceService.GlobalHit(key,'my_profile').
      then(data=>{
          this.userData=data['my_profile']
          this.spinner.hide()
      })
    })
  }

}
