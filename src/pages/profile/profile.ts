import { NavController, AlertController, ActionSheetController, App } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { ProfileData } from '../../providers/profile-data';
import { AuthData } from '../../providers/auth-data';
import { LoginPage } from '../login/login';
import { WelcomePage } from '../welcome/welcome';
import { Camera } from '@ionic-native/camera';

import firebase from 'firebase';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public userProfile: any;
  public birthDate: string;
  public profileImg: string;
  @ViewChild('fileInput') fileInput;

  constructor(public navCtrl: NavController, public profileData: ProfileData, public actionSheetCtrl: ActionSheetController,
    public authData: AuthData, public alertCtrl: AlertController, public cameraPlugin: Camera, public appCtrl: App) {
  }

  ionViewDidEnter(){
    /*var user = firebase.auth().currentUser;
    var name, email, photoUrl, uid;
    if (user != null) {
      name = user.displayName;
      email = user.email;
      photoUrl = user.photoURL;
      uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                       // this value to authenticate with your backend server, if
                       // you have one. Use User.getToken() instead.
      console.log(user.uid);*/
      this.profileData.getUserProfile().on('value', (data) => {
      this.userProfile = data.val();
      this.birthDate = this.userProfile.birthDate;
      this.profileImg = this.userProfile.profilePic;
    });

  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.fileInput.nativeElement.click();
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.getPicture();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
  
   getPicture(){
    this.cameraPlugin.getPicture({
      quality : 95,
      destinationType : this.cameraPlugin.DestinationType.DATA_URL,
      sourceType : this.cameraPlugin.PictureSourceType.CAMERA,
      allowEdit : true,
      encodingType: this.cameraPlugin.EncodingType.PNG,
      targetWidth: 300,
      targetHeight: 300,
      saveToPhotoAlbum: true
    }).then(imageData => {
      //this.guestPicture = imageData;
      this.profileImg = 'data:image/jpg;base64,' +  imageData;
      this.profileData.updatePic(this.profileImg);
      //this.form.patchValue({ 'profilePic': 'data:image/jpg;base64,' +  imageData });
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
      this.fileInput.nativeElement.click();
    });
  }

  processWebImage(event) {
    let input = this.fileInput.nativeElement;

    var reader = new FileReader();
    reader.onload = (readerEvent) => {
      input.parentNode.removeChild(input);

      var imageData = (readerEvent.target as any).result;
      this.profileImg = imageData;
      this.profileData.updatePic(imageData);
      //this.form.patchValue({ 'profilePic': imageData });
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
    return 'url(' + this.profileImg + ')'
  }

  logOut(){
    this.authData.logoutUser().then(() => {
      this.appCtrl.getRootNav().setRoot(WelcomePage, {}, {
      animate: true,
      direction: 'forward'
    });
    });
  }

  updateName(){
    let alert = this.alertCtrl.create({
      message: "Your first name & last name",
      inputs: [
        {
          name: 'firstName',
          placeholder: 'Your first name',
          value: this.userProfile.firstName
        },
        {
          name: 'lastName',
          placeholder: 'Your last name',
          value: this.userProfile.lastName
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileData.updateName(data.firstName, data.lastName);
          }
        }
      ]
    });
    alert.present();
  }

  updateDOB(birthDate){
    this.profileData.updateDOB(birthDate);
  }

  updateUsername(username){
    this.profileData.updateUsername(username);
  }

  updateEmail(){
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newEmail',
          placeholder: 'Your new email',
        },
        {
          name: 'password',
          placeholder: 'Your password',
          type: 'password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileData.updateEmail(data.newEmail, data.password);
          }
        }
      ]
    });
    alert.present();
  }


  updatePassword(){
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newPassword',
          placeholder: 'Your new password',
          type: 'password'
        },
        {
          name: 'oldPassword',
          placeholder: 'Your old password',
          type: 'password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileData.updatePassword(data.newPassword, data.oldPassword);
          }
        }
      ]
    });
    alert.present();
  }
}