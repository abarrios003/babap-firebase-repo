import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EventData } from '../../providers/event-data';

@Component({
  selector: 'page-event-create',
  templateUrl: 'event-create.html',
})
export class EventCreatePage {

  constructor(public navCtrl: NavController, public eventData: EventData) {}

  createEvent(eventName: string, eventDate: string, eventDescription: string) {
    this.eventData.createEvent(eventName, eventDate, eventDescription).then( () => {
      this.navCtrl.pop();
    });
  }

}