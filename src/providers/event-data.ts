import { Injectable } from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import firebase from 'firebase';
import moment from 'moment';

@Injectable()
export class EventData {
  public currentUserId: string;
  public currentBabapId: string;
  //public eventList: firebase.database.Reference;
  public eventList: FirebaseListObservable<any>;
  public eventBabapList: firebase.database.Reference;
  public userProfile: firebase.database.Reference;
  public userData: any;
  public username : string;
  public currentUser: firebase.User;
  //public profilePictureRef: firebase.storage.Reference;

  constructor(af: AngularFire) {
    //this.currentUserId = firebase.auth().currentUser.uid;
    //this.eventList = firebase.database().ref(`babaps`);
    this.getUserProfile().on('value', (data) => {
      this.userData = data.val();
      this.username = this.userData.username;
      //console.log(this.username);
      /*this.eventList.orderByChild("name").equalTo(this.username).on("child_added", function(snapshot) {
        console.log(snapshot.key);
      });*/
      this.eventList = af.database.list('/tasks',{query:{
        orderByChild: 'username',
        equalTo: this.username}
      });
      /*this.eventBabapList.orderByChild("name").equalTo(this.username).on("child_added", function(snapshot) {
          this.currentBabapId = snapshot.key;
          console.log(this.currentBabapId);
          this.eventList = firebase.database().ref(`babaps/${snapshot.key}/eventList`);
      });*/
    });
    //this.eventList = firebase.database().ref(`userProfile/${this.currentUserId}/eventList`);
    //this.profilePictureRef = firebase.storage().ref('/guestProfile/');

  }

  getUserProfile(): firebase.database.Reference {
    this.currentUser = firebase.auth().currentUser;
    this.userProfile = firebase.database().ref('/userProfile');
    return this.userProfile.child(this.currentUser.uid);
  }

  getEventList(): FirebaseListObservable<any> {
    return this.eventList;
  }

  getEventDetail(eventId): firebase.database.Reference {
    //return this.eventList.child(eventId);
    return null;
  }

  createEvent(eventName: string, eventDate: string, eventDescription: string): firebase.Promise<any> {
    let data = moment().format('YYYYMMDD');
    let time = moment().format('HHmmss');
    let datetime = data+time;
    console.log('today is: ', data + ' and time: ', datetime);
    return this.eventList.push({
      name: eventName,
      username: this.username,
      date: eventDate,
      description: eventDescription,
      created: datetime,
    });
  }

  /*createChildEvent(username: string, key: string): void {
    console.log('createChildEvent '+username+'/'+key);
    //var childKey = this.eventChildList.push({name: username}).key;
    this.eventBabapList.orderByChild("name").equalTo(username).on("child_added", function(snapshot) {
       this.eventBabapList.child(snapshot.key).child('childList').push({
        childUid: key
      });
    });
    //var refKey = this.eventBabapList.push({name: username}).key;
  }

  createBabapEvent(username: string): firebase.Promise<any> {
    console.log('createBabapEvent');
    var refKey ='';
    var existente = false;
    this.eventBabapList.orderByChild("name").equalTo(username).on("child_added", function(snapshot) {
      console.log('babap existente');
      console.log(snapshot.key);
      existente=true;
      refKey=snapshot.key;
    });
    if(!existente){
      console.log('babap no existente');
      refKey=this.eventBabapList.push({name: username}).key;
    }
    //var refKey = this.eventBabapList.push({name: username}).key;
    return this.addUser(refKey);
  }


  addUser(uid): firebase.Promise<any> {
      return this.eventBabapList.child(uid).child('userList').push({
        userUid: firebase.auth().currentUser.uid
      });
    }*/

  /*addGuest(guestName, eventId, eventPrice, guestPicture = null): firebase.Promise<any> {
    return this.eventList.child(eventId).child('guestList').push({
      guestName: guestName
    }).then((newGuest) => {
      this.eventList.child(eventId).transaction( (event) => {
        event.revenue += eventPrice;
        return event;
      });
      if (guestPicture != null) {
        this.profilePictureRef.child(newGuest.key).child('profilePicture.png')
      .putString(guestPicture, 'base64', {contentType: 'image/png'})
        .then((savedPicture) => {
          this.eventList.child(eventId).child('guestList').child(newGuest.key).child('profilePicture')
          .set(savedPicture.downloadURL);
        });        
      }
    });
  }*/

}