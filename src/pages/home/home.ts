import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { EventCreatePage } from '../event-create/event-create';
import { EventListPage } from '../event-list/event-list';
import { ItemDetailPage } from '../item-detail/item-detail';
import { ItemCreatePage } from '../item-create/item-create';
import { ProfilePage } from '../profile/profile';
<<<<<<< HEAD
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
=======
import {AngularFire, FirebaseListObservable} from 'angularfire2';
>>>>>>> origin/master
import { EventChildData } from '../../providers/event-child-data';
import { ProfileData } from '../../providers/profile-data';
import { AuthData } from '../../providers/auth-data';
import firebase from 'firebase';

import { Items } from '../../providers/providers';
import { Item } from '../../models/item';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  currentItems: Item[];
  currentUsers: FirebaseListObservable<any>;
  currentChildren: FirebaseListObservable<any>;
  userList: firebase.database.Reference;
  currentChild: FirebaseObjectObservable<any>;
  userProfile: any;
  email:any;
  username: any;

  constructor(public navCtrl: NavController, public items: Items, public navParams: NavParams, public modalCtrl: ModalController,
      public eventChildData: EventChildData, public profileData: ProfileData, af: AngularFire) {
    this.currentItems = this.items.query();
    //this.currentChildren = af.database.list('/children');
    //this.currentUsers = af.database.list('/users');
    //this.username=this.navParams.get('username');

    this.profileData.getUserProfile().on('value', (data) => {
      this.userProfile = data.val();
      //console.log('PROFILE '+JSON.stringify(this.userProfile));
      //this.email=this.userProfile.email;
      this.username=this.userProfile.username;
      //console.log(this.email);
      //console.log(this.username);
      this.currentChildren = af.database.list('/children',{query:{
	      orderByChild: 'username',
	      equalTo: this.username,
	  	  limitToFirst: 1}
	    });
      //this.userList = firebase.database().ref(`users`);
      /*this.currentUsers = af.database.list('/users', { preserveSnapshot: true });
	  this.currentUsers
		  .subscribe(snapshots => {
		    snapshots.forEach(snapshot => {
		      console.log(snapshot.key)
		      console.log(snapshot.val())
		    });
		})*/
      /*this.currentUsers.orderByChild("email").equalTo(this.email).on("child_added", function(data) {
        //console.log('Seteo username a '+data.val().username);
        this.username=data.val().username;
        console.log('username '+this.username);
        this.currentChildren.orderByChild("username").equalTo(this.username).on("child_added", function(data) {
           console.log('Seteo username a '+this.username);
          this.username=this.username;
         });
      });*/
    });
    //this.username='babap';
 	//this.currentChild = af.database.object('/children');
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
  }


  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {
    let addModal = this.modalCtrl.create(ItemCreatePage, {username: this.username});
    addModal.onDidDismiss(item => {
      if (item) {
        this.items.add(item);
      }
    })
    addModal.present();
  }

  addUser() {
    this.currentUsers.push({
      name: "Alejandro Barrios",
      username: "babap",
      email: "alechandler@gmail.com",
      phone: "646201161",
      password: "alex",
      country: "ES"
    }).then( item => {
        if (item) {
          this.items.add(item);
        }
      },error => {
        console.log(error);
      }); 
  }

  /**
   * Delete an item from the list of items.
   */
  deleteItem(item) {
    this.items.delete(item);
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Item) {
    this.navCtrl.push(ItemDetailPage, {
      item: item
    });
  }

  goToProfile(){ this.navCtrl.push(ProfilePage); }
  //goToCreate(){ this.navCtrl.push(EventCreatePage); }

  //goToList(){ this.navCtrl.push(EventListPage); }

}