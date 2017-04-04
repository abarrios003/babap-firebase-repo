import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';

import { TranslateService } from 'ng2-translate/ng2-translate';

import { MainPage } from '../../pages/pages';
import { User } from '../../providers/user';
import { AuthData } from '../../providers/auth-data';

import {AngularFire, FirebaseListObservable, AuthProviders, AuthMethods} from 'angularfire2';

import firebase from 'firebase';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loading: any;
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: {email: string, password: string} = {
    email: 'alechandler@gmail.com',
    password: '6fovajo9'
  };



  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
              public user: User,
              public toastCtrl: ToastController,
              public translateService: TranslateService,
              public alertCtrl: AlertController, 
              public loadingCtrl: LoadingController,
              public navParams: NavParams,
              public af: AngularFire,
              public authData: AuthData) {


    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }
  

  doLogin(): void {
      console.log('doLogin');
      this.authData.loginUser(this.account.email, this.account.password).then( authData => {
        this.loading.dismiss().then( () => {
          this.navCtrl.setRoot(MainPage);
        });
      }, error => {
        this.loading.dismiss().then( () => {
          let alert = this.alertCtrl.create({
            message: error.message,
            buttons: [
              {
                text: "Ok",
                role: 'cancel'
              }
            ]
          });
          alert.present();
        });
      });
      
      this.loading = this.loadingCtrl.create();
      this.loading.present();

  }

}
