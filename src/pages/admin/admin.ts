import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable, Subscription } from 'rxjs/Rx';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { Code } from '../../app/code';
import { User } from '../../app/user';
import { CodeService } from "../../services/code.service";
import { UserService } from "../../services/user.service";
import { ToastService } from "../../services/toast.service";

@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html'
})
export class AdminPage implements OnInit{
  segment: string;
  codeList: FirebaseListObservable<[Code]>;
  userList: FirebaseListObservable<[User]>;
  codeStringChange: boolean;
  loading: any;

  constructor(private userService: UserService,
              private codeService: CodeService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private toastService: ToastService) {}

  ngOnInit(): void {
    this.segment = 'codes';
    this.codeList = this.codeService.getCodeListObservable();
    this.userList = this.userService.getUserListObservable();
    this.codeStringChange = false;
  }

  editCodePrompt(code) {
    let alert = this.alertCtrl.create({
      title: 'Change code',
      inputs: [
        {
          name: 'string',
          placeholder: 'String',
          type: 'text',
          value: code.string
        },
        {
          name: 'cost',
          placeholder: 'Cost',
          type: 'number',
          value: code.cost
        },
        {
          name: '$key',
          type: 'hidden',
          value: code.$key
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.showLoader();
            this.codeService.changeCode(data)
              .subscribe((result) => {
                this.loading.dismiss();
                if (result.success) {
                  this.toastService.showToast('success-toast', 'changed');
                } else {
                  this.toastService.showToast('error-toast', 'not changed');
                }
                return false;
              })
          }
        }
      ]
    });
    alert.present();
  }

  createCodePrompt() {
    let alert = this.alertCtrl.create({
      title: 'Create code',
      inputs: [
        {
          name: 'string',
          placeholder: 'String',
          type: 'text'
        },
        {
          name: 'cost',
          placeholder: 'Cost',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.showLoader();
            this.codeService.createCode(data)
              .subscribe((result) => {
                this.loading.dismiss();
                if (result.success) {
                  this.toastService.showToast('success-toast', 'created');
                } else {
                  this.toastService.showToast('error-toast', 'not created');
                }
                return false;
              })
          }
        }
      ]
    });
    alert.present();
  }

  deleteCode(codeKey) {
    this.showLoader();
    this.codeService.deleteCode(codeKey)
      .subscribe((result) => {
        this.loading.dismiss();
        if (result.success) {
          this.toastService.showToast('success-toast', 'deleted');
        } else {
          this.toastService.showToast('error-toast', 'not deleted');
        }
        return false;
      })
  }

  showLoader(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    this.loading.present();
  }
}
