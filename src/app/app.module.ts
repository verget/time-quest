import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MomentModule } from 'angular2-moment';
import { HttpModule }    from '@angular/http';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AdminPage } from "../pages/admin/admin";

import { UserService } from '../services/user.service';
import { CodeService } from '../services/code.service';
import { ToastService } from "../services/toast.service";

import { TimerPipe } from './timer.pipe';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AdminPage,
    TimerPipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    MomentModule,
    HttpModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
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
    CodeService,
    ToastService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
