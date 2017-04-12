import { Component, ViewChild, NgZone } from '@angular/core';
import {Platform, Nav, Config} from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Settings } from '../providers/providers';

import { FirstRunPage } from '../pages/pages';
import { CardsPage } from '../pages/cards/cards';
import { ContentPage } from '../pages/content/content';
import { LoginPage } from '../pages/login/login';
import { MainPage } from '../pages/pages';
import { MapPage } from '../pages/map/map';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { WelcomePage } from '../pages/welcome/welcome';
import { ListMasterPage } from '../pages/list-master/list-master';
import { MenuPage } from '../pages/menu/menu';
import { SettingsPage } from '../pages/settings/settings';
import { SearchPage } from '../pages/search/search';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { ProfilePage } from '../pages/profile/profile';
import { EventCreatePage } from '../pages/event-create/event-create';
import { EventDetailPage } from '../pages/event-detail/event-detail';
import { EventListPage } from '../pages/event-list/event-list';
import { ChildListPage } from '../pages/child-list/child-list';
import { HomePage } from '../pages/home/home';

import { TranslateService } from 'ng2-translate/ng2-translate';
import firebase from 'firebase';

@Component({
  template: `<!--<ion-menu [content]="content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Pages</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
          {{p.title}}
        </button>
      </ion-list>
    </ion-content>

  </ion-menu>-->
  <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = FirstRunPage;
  zone: NgZone;

  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    { title: 'Tutorial', component: TutorialPage },
    { title: 'Welcome', component: WelcomePage },
    { title: 'Tabs', component: TabsPage },
    { title: 'Cards', component: CardsPage },
    { title: 'Content', component: ContentPage },
    { title: 'Login', component: LoginPage },
    { title: 'Signup', component: SignupPage },
    { title: 'Map', component: MapPage },
    { title: 'Master Detail', component: ListMasterPage },
    { title: 'Menu', component: MenuPage },
    { title: 'Settings', component: SettingsPage },
    { title: 'ResetPassword', component: ResetPasswordPage },
    { title: 'Profile', component: ProfilePage },
    { title: 'EventCreate', component: EventCreatePage },
    { title: 'EventDetail', component: EventDetailPage },
    { title: 'EventList', component: EventListPage },
    { title: 'ChildList', component: ChildListPage},
    { title: 'Home', component: HomePage },
    { title: 'Search', component: SearchPage }
  ]

  constructor(translate: TranslateService, platform: Platform, settings: Settings, config: Config) {
    this.zone = new NgZone({});

    firebase.initializeApp({
      apiKey: "AIzaSyAhXw6GyoDmXA4OiAo91yjeYGlus2eQm-A",
      authDomain: "babap-97000.firebaseapp.com",
      databaseURL: "https://babap-97000.firebaseio.com",
      storageBucket: "babap-97000.appspot.com",
      messagingSenderId: "2077142488"
    });

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      this.zone.run( () => {
        if (!user) {
          this.rootPage = FirstRunPage;
          unsubscribe();
        } else { 
          this.nav.setRoot(MainPage);
          unsubscribe();
        }
      }); 
    });
    // Set the default language for translation strings, and the current language.
    translate.setDefaultLang('en');
    translate.use('en')

    translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
