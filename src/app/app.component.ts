import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { AdminPage } from '../pages/admin/admin';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = HomePage;
  pages: Array<{ title: string, component: any }>;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              public menu: MenuController) {

    this.pages = [
      { title: 'Admin Page', component: AdminPage },
      { title: 'Home Page', component: HomePage }
    ];
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

