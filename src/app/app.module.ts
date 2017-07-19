import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule }    from '@angular/http';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { config } from '../environments/environment';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { AdminPage } from "../pages/admin/admin";

import { UserService } from '../services/user.service';
import { CodeService } from '../services/code.service';
import { ToastService } from "../services/toast.service";

import { TimerPipe } from './timer.pipe';


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    AdminPage,
    TimerPipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    AngularFireModule.initializeApp(config.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    AdminPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UserService,
    CodeService,
    ToastService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
