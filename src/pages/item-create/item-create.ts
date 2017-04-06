import { Component, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, ViewController ,NavParams} from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { EventChildData } from '../../providers/event-child-data';
import { ProfileData } from '../../providers/profile-data';
import { AuthData } from '../../providers/auth-data';
import firebase from 'firebase';

import { Camera } from '@ionic-native/camera';

/*
  Generated class for the ItemCreate page.
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-item-create',
  templateUrl: 'item-create.html'
})
export class ItemCreatePage {
  @ViewChild('fileInput') fileInput;
  public userProfile: any;

  isReadyToSave: boolean;
  public userList: firebase.database.Reference;
  item: any;
  username: any;
  form: FormGroup;
  currentChildren: FirebaseListObservable<any>;
  child: {name: string, gender: string, birthday: string, username: string} = {
      name: 'Complete Name',
      gender: '1',
      birthday: '17/06/2017',
      username: 'babap'
    };

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public eventChildData: EventChildData,
    public profileData: ProfileData, public authData: AuthData, public cameraPlugin: Camera, formBuilder: FormBuilder, public af: AngularFire) {
    this.form = formBuilder.group({
      profilePic: [''],
      name: ['', Validators.required],
      gender: ['', Validators.required],
      birthday: ['', Validators.required]
    });



    this.username=this.navParams.get('username');
    console.log('username '+this.username);

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      console.log(v);
      this.item=v;
      this.isReadyToSave = this.form.valid;
    });

    this.currentChildren = af.database.list('/children');
  }

  ionViewDidLoad() {

    /*this.profileData.getUserProfile().on('value', (data) => {
      this.userProfile = data.val();
      console.log('PROFILE '+JSON.stringify(this.userProfile));
      console.log(this.userProfile.email);
      this.userList = firebase.database().ref(`users`);
      this.userList.orderByChild("email").equalTo(this.userProfile.email).on("child_added", function(data) {
        console.log('Seteo username a '+data.val().username);
        this.username=data.val().username;
      });
      //this.username=this.navParams.get('username');
      console.log('username '+this.username);
    });*/

  }
   
   getPicture(){
    this.cameraPlugin.getPicture({
      quality : 95,
      destinationType : this.cameraPlugin.DestinationType.DATA_URL,
      sourceType : this.cameraPlugin.PictureSourceType.CAMERA,
      allowEdit : true,
      encodingType: this.cameraPlugin.EncodingType.PNG,
      targetWidth: 120,
      targetHeight: 120,
      saveToPhotoAlbum: true
    }).then(imageData => {
      //this.guestPicture = imageData;
      this.form.patchValue({ 'profilePic': 'data:image/jpg;base64,' +  imageData });
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
      this.fileInput.nativeElement.click();
    });
  }

  /*getPicture() {
    if (Camera['installed']()) {
      Camera.getPicture({
        targetWidth: 96,
        targetHeight: 96
      }).then((data) => {
        this.form.patchValue({ 'profilePic': 'data:image/jpg;base64,' +  data });
      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      this.fileInput.nativeElement.click();
    }
  }*/

  processWebImage(event) {
    let input = this.fileInput.nativeElement;

    var reader = new FileReader();
    reader.onload = (readerEvent) => {
      input.parentNode.removeChild(input);

      var imageData = (readerEvent.target as any).result;
      this.form.patchValue({ 'profilePic': imageData });
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
    return 'url(' + this.form.controls['profilePic'].value + ')'
  }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
  done() {
    if(!this.form.valid) { 
      return; 
    }else{
      this.item.username = this.username;
      console.log(JSON.stringify(this.item));
      var refKey=this.currentChildren.push(this.item).key;
      this.eventChildData.createChildEvent(this.username, refKey);
      /*this.currentChildren.push(this.item).then( item => {
        if (item) {
          //this.navCtrl.push(MainPage);
          console.log('create success');
          return item;
        }
      },error => {
        console.log(error);
      }); */
    }
    this.viewCtrl.dismiss(this.form.value);
  }
}
