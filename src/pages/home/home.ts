import { Component, OnInit, OnDestroy, Injectable, Inject } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Observable, Subscription } from 'rxjs/Rx';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { FirebaseApp } from "angularfire2";

import { UserService } from "../../services/user.service";
import { ToastService } from "../../services/toast.service";
import { ToolsService } from "../../services/tools.service";
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
  messageToSend: string;
  _messaging: firebase.messaging.Messaging;

  constructor(private afAuth: AngularFireAuth,
              private toolsService: ToolsService,
              private toastService: ToastService,
              private userService: UserService,
              private loadingCtrl: LoadingController,
              @Inject(FirebaseApp) private _firebaseApp: firebase.app.App,
              public navCtrl: NavController) {

    this.currentUser = {
      name: '',
      endTime: 0,
      uid: '',
      email: '',
      role: 'user',
      usedCodes: {},
      notificationTokens: {}
    };

    this.afAuth.authState.subscribe(user => {
      if (user != null)
        return true;
      this.navCtrl.push(LoginPage);
    })
  };

  ngOnInit(): void {
    this._messaging = firebase.messaging(this._firebaseApp);
    this.userService.currentLocalUser.subscribe((userObject) => {
      this.currentUser = userObject;
      this._messaging.requestPermission().then(() => {
        console.log('Notification permission granted.');
        this._messaging.getToken().then((currentToken) => {
          if (currentToken) {
            let isSaved = this.toolsService.isInObjectValues(userObject.notificationTokens, currentToken);
            if (!isSaved) {
              this.userService.saveNotificationToken(currentToken, userObject.uid)
                .take(1)
                .subscribe((res) => {
                  console.log(res);
                  this._messaging.onTokenRefresh(() => {
                    this._messaging.getToken()
                      .then((refreshedToken) => {
                        console.log('Token refreshed.');
                        this.userService.saveNotificationToken(refreshedToken, userObject.uid)
                          .take(1)
                          .subscribe((res) => {
                            console.log(res);
                          })
                      }).catch((err) => {
                      console.log('Unable to retrieve refreshed token ', err);
                    });
                  });
                })
            }
          } else {
            console.log('No Instance ID token available. Request permission to generate one.');
          }
        }).catch(function(err) {
            console.log('An error occurred while retrieving token. ', err);
          });
      }).catch(function(err) {
          console.log('Unable to get permission to notify.', err);
        });
    });

    this.timer = Observable.timer(0, 1000)
      .subscribe((t) => {
        let currentTimestamp = new Date().getTime();
        if (this.currentUser) {
          this.timeDiff = this.currentUser.endTime - currentTimestamp;
        }
      });
  }

  sendMessageToUser(): void {
    this.showLoader();
    this.userService.sendNotificationToUser(this.currentUser.uid, this.messageToSend)
      .take(1)
      .subscribe((res) => {
        this.loading.dismiss();
        if (res.success) {
          this.toastService.showToast('success-toast', 'success');
        } else {
          this.toastService.showToast('error-toast', 'undefind error');
        }
      })
  }

  ngOnDestroy(): void {
    this.timer.unsubscribe();
  }

  checkCode(): void {
    if (this.codeString) {
      this.showLoader();
      this.userService.useCode(this.codeString, this.currentUser.uid) //todo need validation
        .take(1)
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
        },
          (err) => {
            console.log('1111');
            console.log(err);
            this.loading.dismiss();
            this.codeString = '';
            this.toastService.showToast('error-toast', 'undefind error');
          })
    }
  }

  logout() {
    return this.userService.logOut();
  };

  showLoader(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });

    this.loading.present();
  }
}
