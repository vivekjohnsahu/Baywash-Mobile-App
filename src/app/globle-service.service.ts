import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ModalController, NavController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastController} from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class GlobleServiceService {

  public BaseUrl_image= 'https://ejobshire.com/baywash//assets_modern_admin/baywash/supervisor';
  public BaseUrl= 'https://ejobshire.com/baywash/Webservices_controller/auth/';
  public apikey = 'baywash_B51r143567';
  is_arry=[]
  chek_page_customer='false'

  constructor(
    public http: HttpClient,
    public modalController: ModalController,
    public spinner: NgxSpinnerService,
    public toastController: ToastController,
  ) { }

  GlobalHit(data,url){
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    return new Promise((resolve, reject) => {
         this.http.post(this.BaseUrl+url,data,{"headers":headers}).subscribe((response) => {
        resolve(response);
      }, 
      (err) => {
        reject(err);
        this.spinner.hide()
        this.alertMsg("Please check internet connection and try again")
      });
    });
  }

  GlobalGetHit(data,url){
    let params = new HttpParams();
    params=params.append('apikey', data.apikey);
    params=params.append('user_id', data.user_id);
    params=params.append('access_token', data.access_token);
    params=params.append('society_id', data.society_id);
    params=params.append('customer_type', data.customer_type);
    params=params.append('search', data.search);
    return new Promise((resolve, reject) => {
         this.http.get(this.BaseUrl+url,{params: params}).subscribe((response) => {
        resolve(response);
      }, 
      (err) => {
        reject('ERR_INTERNET_DISCONNECTED');
        this.spinner.hide()
        this.alertMsg("Please check internet connection and try again")
      });
    });
  }

  GlobalGetHitFilter(data,url){
    let params = new HttpParams();
    params=params.append('apikey', data.apikey);
    params=params.append('user_id', data.user_id);
    params=params.append('access_token', data.access_token);
    params=params.append('search', data.search);
    params=params.append('society_id', data.society_id);
    params=params.append('customer_type', data.customer_type);
    return new Promise((resolve, reject) => {
         this.http.get(this.BaseUrl+url,{params: params}).subscribe((response) => {
        resolve(response);
      }, 
      (err) => {
        reject('ERR_INTERNET_DISCONNECTED');
        this.spinner.hide()
        this.alertMsg("Please check internet connection and try again")
      });
    });
  }

  GlobalGetHitCustomer(data,url){
    let params = new HttpParams();
    params=params.append('apikey', data.apikey);
    params=params.append('user_id', data.user_id);
    params=params.append('access_token', data.access_token);
    params=params.append('cust_id', data.cust_id);
    params=params.append('car_thumb', data.car_thumb);
    params=params.append('society_id', data.society_id);
    return new Promise((resolve, reject) => {
         this.http.get(this.BaseUrl+url,{params: params}).subscribe((response) => {
        resolve(response);
      }, 
      (err) => {
        reject('ERR_INTERNET_DISCONNECTED');
        this.spinner.hide()
        this.alertMsg("Please check internet connection and try again")
      });
    });
  }

  saveSingleCarId(id){
    this.is_arry.push(id)
  }

  chekPageCustomer(vls){
    this.chek_page_customer=vls
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
  
}


