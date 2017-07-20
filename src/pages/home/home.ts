import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Observable, Subscription } from 'rxjs/Rx';
import { AngularFireAuth } from 'angularfire2/auth';

import { UserService } from "../../services/user.service";
import { ToastService } from "../../services/toast.service";
import { User } from "../../app/user";
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnDestroy{
  timer: Subscription;
  timeDiff: number = 0;
  codeString: string;
  currentUser: User;
  loading: any;

  constructor(private afAuth: AngularFireAuth,
              private toastService: ToastService,
              private userService: UserService,
              private loadingCtrl: LoadingController,
              public navCtrl: NavController) {

    // afAuth.authState.subscribe(user => {
    //   if (user) {
    //     console.log('user subscribe in home', user);
    //     this.currentUser = user;
    //     return;
    //   }
    //   this.navCtrl.push(LoginPage);
    // });
    console.log('im page constructor');
  }

  ngOnInit(): void {
    console.log('im page onInit');
    console.log(this.userService.currentUser);
    this.userService.currentUser.subscribe((userObject) => {
      console.log('=========');
      console.log(userObject);
      this.currentUser = userObject;
    });
    this.timer = Observable.timer(0, 1000)
      .subscribe((t) => {
        let currentTimestamp = new Date().getTime();
        if (this.currentUser) {
          this.timeDiff = this.currentUser.endTime - currentTimestamp;
        }
      });
  }

  ngOnDestroy(): void {
    this.timer.unsubscribe();
  }

  checkCode(): void {
    if (this.codeString) {
      this.showLoader();
      this.userService.useCode(this.codeString, this.currentUser.uid) //todo need validation
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
