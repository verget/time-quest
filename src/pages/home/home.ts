import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  myDate: Date;
  constructor(public navCtrl: NavController) {
    this.myDate  = new Date();
  }

}
