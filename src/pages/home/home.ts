import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import {Observable, Subscription} from 'rxjs/Rx';
import { UserService } from "../../services/user.service";
import { CodeService } from "../../services/code.service";
import {ToastService} from "../../services/toast.service";

import { User }         from '../../app/user';

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

  constructor(public navCtrl: NavController,
              private toastService: ToastService,
              private userService: UserService,
              private codeService: CodeService,
              public loadingCtrl: LoadingController) {}


  ngOnInit(): void {
    let currentTimestamp = new Date().getTime();
    this.loading.present();
    this.userService.getUser(0).then(currentUser => {
      this.loading.dismiss();
      this.timer = Observable.timer(0, 1000)
        .subscribe((t) => {
          currentTimestamp = new Date().getTime();
          this.timeDiff = currentUser.endTime - currentTimestamp;
        });
    });
  }

  ngOnDestroy(): void {
    this.timer.unsubscribe();
  }

  checkCode(): void {
    if (this.codeString) {
      this.codeService.getCode(this.codeString)
        .then((codeObject) => {
          console.log(codeObject);
        })
        .catch((err) => {
          console.error(err);
        })
    }
  }
}
