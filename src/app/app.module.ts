import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MomentModule } from 'angular2-moment';
import { HttpModule }    from '@angular/http';
import {InMemoryWebApiModule} from 'angular-in-memory-web-api';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {AdminPage} from "../pages/admin/admin";

import {FakeDataService} from '../services/fake-data.service';
import {UserService} from '../services/user.service';
import {ToastService} from "../services/toast.service";
import {CountdownPipe} from './countdown.pipe';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CountdownPipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    MomentModule,
    HttpModule,
    InMemoryWebApiModule.forRoot(FakeDataService)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AdminPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UserService,
    ToastService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
