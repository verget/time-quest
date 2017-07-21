import { Component, OnInit, OnDestroy, Injectable, Inject } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Observable, Subscription } from 'rxjs/Rx';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { FirebaseApp } from "angularfire2";

import { UserService } from "../../services/user.service";
import { ToastService } from "../../services/toast.service";
import { User } from "../../app/user";
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

@Injectable()
export class HomePage implements OnInit, OnDestroy{
  timer: Subscription;
  timeDiff: number = 0;
  codeString: string;
  currentUser: User;
  loading: any;
  _messaging: firebase.messaging.Messaging;

  constructor(private afAuth: AngularFireAuth,
              private toastService: ToastService,
              private userService: UserService,
              private loadingCtrl: LoadingController,
              @Inject(FirebaseApp) private _firebaseApp: firebase.app.App,
              public navCtrl: NavController) {

    afAuth.authState.subscribe(user => {
      if (user) {
        console.log('user subscribe in home', user);
        // this.currentUser = user;
        return;
      }
      this.navCtrl.push(LoginPage);
    });
  };

  ngOnInit(): void {
    // this.userService.currentLocalUser.subscribe((userObject) => {
    //   console.log('=========');
    //   console.log(userObject);
    //   this.currentUser = userObject;
    // });
    this.timer = Observable.timer(0, 1000)
      .subscribe((t) => {
        let currentTimestamp = new Date().getTime();
        if (this.currentUser) {
          this.timeDiff = this.currentUser.endTime - currentTimestamp;
        }
      });

    this._messaging = firebase.messaging(this._firebaseApp);
    this._messaging.requestPermission().then(() => {
      console.log('Notification permission granted.');
      this._messaging.getToken().then((currentToken) => {
        if (currentToken) {
          this.userService.saveMessagingToken(currentToken);

          this._messaging.onTokenRefresh(function() {
            this._messaging.getToken()
              .then(function(refreshedToken) {
                console.log('Token refreshed.');
                // Indicate that the new Instance ID token has not yet been sent to the
                // app server.
                this.userService.saveMessagingToken(refreshedToken);
              })
              .catch(function(err) {
                console.log('Unable to retrieve refreshed token ', err);
                //showToken('Unable to retrieve refreshed token ', err);
              });
          });
        } else {
          console.log('No Instance ID token available. Request permission to generate one.');
        }
      })
        .catch(function(err) {
          console.log('An error occurred while retrieving token. ', err);
        });
    })
      .catch(function(err) {
        console.log('Unable to get permission to notify.', err);
      });
  }

  ngOnDestroy(): void {
    this.timer.unsubscribe();
  }

  checkCode(): void {
    if (this.codeString) {
      this.showLoader();
      this.userService.useCode(this.codeString, this.userService.currentUserObject.uid) //todo need validation
        .subscribe((result) => {
          this.loading.dismiss();
          this.codeString = '';
          if (result.success) {
            this.toastService.showToast('success-toast', 'success'); //todo need error texts
          } else if (result.errorCode == 1001) { //todo need errorCodes list
            this.toastService.showToast('warning-toast', 'already used');
          } else if (result.errorCode == 1004) {
            this.toastService.showToast('error-toast', 'wrong code');
          } else {
            this.toastService.showToast('error-toast', 'undefind error');
          }
        });
    }
  }

  logout() {
    return this.userService.logOut();
  };

  showLoader(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    this.loading.present();
  }
}
