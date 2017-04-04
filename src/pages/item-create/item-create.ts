import { Component, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, ViewController ,NavParams} from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

import { Camera } from 'ionic-native';

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

  isReadyToSave: boolean;

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

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, formBuilder: FormBuilder, public af: AngularFire) {
    this.form = formBuilder.group({
      profilePic: [''],
      name: ['', Validators.required],
      gender: ['', Validators.required],
      birthday: ['', Validators.required]
    });

    this.username=this.navParams.get('username');

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      console.log(v);
      this.item=v;
      this.isReadyToSave = this.form.valid;
    });

    this.currentChildren = af.database.list('/children');
  }

  ionViewDidLoad() {

  }

  getPicture() {
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
  }

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
      console.log(JSON.stringify(this.item));
      this.currentChildren.push(this.item).then( item => {
        if (item) {
          //this.navCtrl.push(MainPage);
          console.log('create success');
          return item;
        }
      },error => {
        console.log(error);
      }); 
    }
    this.viewCtrl.dismiss(this.form.value);
  }
}
