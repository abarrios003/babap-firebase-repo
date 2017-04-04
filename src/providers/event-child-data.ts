import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class EventChildData {
  public currentUser: string;
  public eventList: firebase.database.Reference;
  public eventChildList: firebase.database.Reference;
  public eventBabapList: firebase.database.Reference;
  public profilePictureRef: firebase.storage.Reference;
  public eventBabap: firebase.Promise<any>;

  constructor() {
    //this.currentUser = firebase.auth().currentUser.uid;
    //this.eventList = firebase.database().ref(`userProfile/${this.currentUser}/eventList`);
    this.eventChildList = firebase.database().ref(`children`);
    this.eventBabapList = firebase.database().ref(`babaps`);
    //this.profilePictureRef = firebase.storage().ref('/guestProfile/');

  }

  /*getEventList(): firebase.database.Reference {
    return this.eventList;
  }

  getEventDetail(eventId): firebase.database.Reference {
    return this.eventList.child(eventId);
  }*/

  createChildEvent(username: string, key: string): void {
    console.log('createChildEvent');
    var childKey = this.eventChildList.push({name: username}).key;
    this.eventBabapList.orderByChild("name").equalTo(username).on("child_added", function(snapshot) {
       this.eventBabapList.child(snapshot.key).child('childList').push({
        childUid: key
      });
    });
    //var refKey = this.eventBabapList.push({name: username}).key;
  }

  createBabapEvent(username: string): firebase.Promise<any> {
    console.log('createBabapEvent');
    /*this.eventBabap = this.eventBabapList.push({name: username}).then( item => {
            if (item) {
              //this.navCtrl.push(MainPage);
              console.log('new babap '+item.key());
              //this.addUser(item.uid);
              this.eventBabapList.child(item.key()).child('userList').push({
                userUid: firebase.auth().currentUser.uid
              });
            }
          },error => {
            console.log(error);
          });
    return this.eventBabap;*/
    //var ref = firebase.database().ref("babaps");
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
      //console.log('addUser '+this.currentUser.uid+' to babap '+uid);
      //var usuario = firebase.auth().currentUser;
      //console.log('addUser '+firebase.auth().currentUser.uid+' to babap '+uid);
      return this.eventBabapList.child(uid).child('userList').push({
        userUid: firebase.auth().currentUser.uid
      });
    }

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