import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable, Subscription } from 'rxjs/Rx';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import { Code } from '../../app/code';
import { User } from '../../app/user';
import { CodeService } from "../../services/code.service";
import { UserService } from "../../services/user.service";
import { ToastService } from "../../services/toast.service";
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html'
})
export class AdminPage implements OnInit{
  segment: string;
  codeList: FirebaseListObservable<[Code]>;
  userList: Observable<[User]>;
  codeStringChange: boolean;
  loading: any;
  currentUser: User;

  constructor(private afAuth: AngularFireAuth,
              private userService: UserService,
              private codeService: CodeService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private toastService: ToastService,
              public navCtrl: NavController) {

    this.afAuth.authState.subscribe(user => {
      if (user != null)
        return true;
      this.navCtrl.push(LoginPage);
    })
  }

  ngOnInit(): void {
    this.userService.currentLocalUser.subscribe((userObject) => {
      this.currentUser = userObject;
      if (this.currentUser.role != 'admin') {
        this.navCtrl.push(HomePage);
      }
    });

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
              .take(1)
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
              .take(1)
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

  deleteCode(codeKey:string) {
    this.showLoader();
    this.codeService.deleteCode(codeKey)
      .take(1)
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

  deleteUser(uid:string) {
    this.showLoader();
    this.userService.deleteUser(uid)
      .take(1)
      .subscribe((result) => {
        this.loading.dismiss();
        if (result.success) {
          this.toastService.showToast('success-toast', 'deleted');
        } else {
          this.toastService.showToast('error-toast', 'not deleted');
        }
        return false;
      })
  };

  changeEndTime(user: User) {
    this.showLoader();
    let changedTime = Date.parse(user.formatedEndTime);
    this.userService.changeUserTime(user.uid, changedTime)
      .take(1)
      .subscribe((result) => {
        this.loading.dismiss();
        if (result.success) {
          this.toastService.showToast('success-toast', 'changed');
        } else {
          this.toastService.showToast('error-toast', 'not changed');
        }
        return false;
      },
        (err) => {
          console.error(err);
          this.loading.dismiss();
        })
  }

  showLoader(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });

    this.loading.present();
  }
}
