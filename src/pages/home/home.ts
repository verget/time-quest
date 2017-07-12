import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Observable, Subscription } from 'rxjs/Rx';
import { UserService } from "../../services/user.service";
import { CodeService } from "../../services/code.service";
import { ToastService } from "../../services/toast.service";

import { FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';

import { User } from "../../app/user";

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
  currentUser: User;

  constructor(private navCtrl: NavController,
              private toastService: ToastService,
              private userService: UserService,
              private codeService: CodeService,
              private loadingCtrl: LoadingController) {
  }

  ngOnInit(): void {
    this.userService.currentUser.subscribe((userObject) => {
      this.currentUser = userObject;
      this.timer = Observable.timer(0, 1000)
        .subscribe((t) => {
          let currentTimestamp = new Date().getTime();
          this.timeDiff = this.currentUser.endTime - currentTimestamp;
        });
    });
  }

  ngOnDestroy(): void {
    this.timer.unsubscribe();
  }

  checkCode(): void {
    if (this.codeString) {
      this.userService.enterCode(this.codeString)
        .then((result) => {
          if (result) {
            this.toastService.showToast('success-toast', 'success');
          } else {
            this.toastService.showToast('error-toast', 'error');
          }
          this.codeString = '';
        });
    }
  }
}
