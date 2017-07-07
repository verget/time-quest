import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Observable, Subscription} from 'rxjs/Rx';
import { UserService } from "../../services/user.service";
import {ToastService} from "../../services/toast.service";

import { User } from '../../app/user';

@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html'
})
export class AdminPage implements OnInit, OnDestroy{
  currentTimestamp: number = 0;
  currentUser: User;
  timer: Subscription;

  constructor(public navCtrl: NavController,
              private toastService: ToastService,
              private userService: UserService) {}

  ngOnInit(): void {
    this.getUser();
    this.timer = Observable.timer(0, 1000)
      .subscribe((t) => {
        this.currentTimestamp = new Date().getTime();
      });
  }

  ngOnDestroy(): void {
    this.timer.unsubscribe();
  }

  getUser(): void {
    this.userService.getUser(0).then(user => {
      this.currentUser = user
    });
  }
}