import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EventDetailPage } from '../event-detail/event-detail';
import { EventChildData } from '../../providers/event-child-data';

import {AngularFire, FirebaseListObservable} from 'angularfire2';

@Component({
  selector: 'page-child-list',
  templateUrl: 'child-list.html',
})
export class ChildListPage {
  public childList: FirebaseListObservable<any>;


  constructor(public navCtrl: NavController, public eventChildData: EventChildData, af: AngularFire) {
    this.childList = af.database.list('/children');
  }

  ionViewDidEnter(){
    /*this.eventChildData.getEventList().on('value', snapshot => {
      let rawList = [];
      snapshot.forEach( snap => {
        rawList.push({
          id: snap.key,
          name: snap.val().name,
          gender: snap.val().gender,
          birthdate: snap.val().birthdate,
          profilePic: snap.val().profilePic
        });
      return false
      });
      this.childList = rawList;
    });*/
  }

  goToChildDetail(eventId){
    this.navCtrl.push(EventDetailPage, { eventId: eventId });
  }
}