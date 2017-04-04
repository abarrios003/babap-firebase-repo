import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { EventCreatePage } from '../event-create/event-create';
import { EventListPage } from '../event-list/event-list';
import { ItemDetailPage } from '../item-detail/item-detail';
import { ItemCreatePage } from '../item-create/item-create';
//import { UserCreatePage } from '../signup/signup';

import { Items } from '../../providers/providers';
import { Item } from '../../models/item';

import {AngularFire, FirebaseListObservable} from 'angularfire2';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  currentItems: Item[];
  currentUsers: FirebaseListObservable<any>;
  currentChildren: FirebaseListObservable<any>;
  username: any;

  constructor(public navCtrl: NavController, public items: Items, public navParams: NavParams, public modalCtrl: ModalController, af: AngularFire) {
    this.currentItems = this.items.query();
    this.currentChildren = af.database.list('/children');
    this.currentUsers = af.database.list('/users');
    this.username=this.navParams.get('username');
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

  //goToCreate(){ this.navCtrl.push(EventCreatePage); }

  //goToList(){ this.navCtrl.push(EventListPage); }

}