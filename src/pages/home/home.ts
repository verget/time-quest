import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Observable, Subscription } from 'rxjs/Rx';
import { UserService } from "../../services/user.service";
import { CodeService } from "../../services/code.service";
import { ToastService } from "../../services/toast.service";

import {FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2/database';

import {User} from "../../app/user";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnDestroy{
  timer: Subscription;
  timeDiff: number = 0;
  loading: any = this.loadingCtrl.create({
    content: 'Please wait...'
  });
  codeString: string;
  currentUser: FirebaseObjectObservable<User>;
  users: FirebaseListObservable<any[]>;

  constructor(public navCtrl: NavController,
              private toastService: ToastService,
              private userService: UserService,
              private codeService: CodeService,
              public loadingCtrl: LoadingController) {

    this.users = this.userService.getUsers();
  }


  ngOnInit(): void {
    let currentTimestamp = new Date().getTime();
    this.loading.present();
    this.currentUser = this.userService.getUser(0);
    this.currentUser.subscribe((currentUser) => {
      this.timer = Observable.timer(0, 1000)
        .subscribe((t) => {
          currentTimestamp = new Date().getTime();
          this.timeDiff = currentUser.endTime - currentTimestamp;
        });
    });
    // this.userService.getUser(0).then(user => {
    //   this.currentUser = user;
    //   this.loading.dismiss();
    //
    // });
  }

  ngOnDestroy(): void {
    this.timer.unsubscribe();
  }

  checkCode(): void {
    if (this.codeString) {
      this.codeService.getCode(this.codeString)
        .then((codeArray) => {
          if (codeArray.length) {
            this.toastService.showToast('success-toast', 'success');
            this.currentUser.endTime += codeArray[0].cost;
          } else {
            this.toastService.showToast('error-toast', 'error');
          }
          this.codeString = '';
        })
    }
  }
}
