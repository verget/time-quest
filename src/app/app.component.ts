import { Component, ViewChild, Injectable, Inject} from '@angular/core';
import { Platform, MenuController, Nav, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as firebase from 'firebase';
import { FirebaseApp } from "angularfire2";

import { UserService } from "../services/user.service";
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { AdminPage } from '../pages/admin/admin';

@Component({
  templateUrl: 'app.html'
})

@Injectable()
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = HomePage;
  pages: Array<{ title: string, component: any }>;
  _messaging: firebase.messaging.Messaging;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              @Inject(FirebaseApp) private _firebaseApp: firebase.app.App,
              public menu: MenuController,
              public events: Events) {

    this.pages = [
      { title: 'Admin Page', component: AdminPage },
      { title: 'Home Page', component: HomePage }
    ];

    this.events.subscribe('user:logout', () => {
      this.nav.setRoot(LoginPage);
    });

    this._messaging = firebase.messaging(this._firebaseApp);
    navigator.serviceWorker.register('../../service-worker.js') //register custom service-worker for firebase cloud messaging
      .then((registration) => {
        this._messaging.useServiceWorker(registration);
      })
      .catch((err) => {
        console.log('Im instead usedServiceWorker ');
        console.error(err);
      });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}

