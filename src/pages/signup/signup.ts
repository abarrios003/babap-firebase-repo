import { Component } from '@angular/core';
import { NavController, ToastController,LoadingController, AlertController } from 'ionic-angular';

import { TranslateService } from 'ng2-translate/ng2-translate';

import { MainPage } from '../../pages/pages';
import { User } from '../../providers/user';
import { AuthData } from '../../providers/auth-data';
import { EventChildData } from '../../providers/event-child-data';

import {AngularFire, FirebaseListObservable} from 'angularfire2';

/*
  Generated class for the Signup page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  loading: any;
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: {name: string, email: string, password: string, username: string, phone: string, country: string} = {
    name: 'Complete Name',
    email: 'test@example.com',
    password: 'test',
    username: 'babap',
    phone: '646201161',
    country: 'ES'
  };
  currentUsers: FirebaseListObservable<any>;
  currentBabaps: FirebaseListObservable<any>;

  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
              public user: User,
              public toastCtrl: ToastController,
              public translateService: TranslateService,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public authData: AuthData,
              public eventChildData: EventChildData,
              public af: AngularFire) {

    this.currentUsers = af.database.list('/users');
    this.currentBabaps = af.database.list('/babaps');

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
  }


  doSignup() {
    console.log(JSON.stringify(this.account));

    this.authData.signupUser(this.account.email, this.account.password)
      .then(() => {
        this.loading.dismiss().then( () => {
          this.currentUsers.push(this.account).then( item => {
            if (item) {
              //this.navCtrl.push(MainPage);
              console.log('new user created '+item);
              this.eventChildData.createBabapEvent(this.account.username).then( () => {
                this.navCtrl.setRoot(MainPage);
              });
            }
          },error => {
            console.log(error);
          }); 
        });
      }, (error) => {
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


  doSignup2() {
    console.log(JSON.stringify(this.account));

    this.authData.signupUser(this.account.email, this.account.password)
      .then(() => {
        this.loading.dismiss().then( () => {
          this.currentUsers.push(this.account).then( item => {
            if (item) {
              this.navCtrl.setRoot(MainPage);
              //this.navCtrl.push(MainPage);
            }
          },error => {
            console.log(error);
          }); 
        });
      }, (error) => {
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
