import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { EventDetailPage } from '../event-detail/event-detail';
import { EventData } from '../../providers/event-data';
import {EventCreatePage} from '../event-create/event-create';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';

@Component({
  selector: 'page-event-list',
  templateUrl: 'event-list.html',
})
export class EventListPage {
  public eventList: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public eventData: EventData) {}

  ionViewDidEnter(){
    /*this.eventData.getEventList().on('value', snapshot => {
      let rawList = [];
      snapshot.forEach( snap => {
        rawList.push({
          id: snap.key,
          name: snap.val().name,
          description: snap.val().description,
          date: snap.val().date,
        });
      return false
      });
      this.eventList = rawList;
    });*/
    this.eventList = this.eventData.getEventList();
    console.log(this.eventList);
  }

  addTask() {
    let addModal = this.modalCtrl.create(EventCreatePage, {});
    addModal.onDidDismiss(item => {
      /*if (item) {
        this.items.add(item);
      }*/
    })
    addModal.present();
  }

  /*goToEventDetail(eventId){
    this.navCtrl.push(EventDetailPage, { eventId: eventId });
  }*/
}