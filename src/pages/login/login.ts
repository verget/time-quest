import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { UserService } from "../../services/user.service";
import { ToastService } from "../../services/toast.service";

import { HomePage } from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loading: any;
  userSignInEmail: string;
  userSignInPassword: string;
  userSignUpEmail: string;
  userSignUpPassword: string;
  userSignUpNickname: string;
  segment: string;
  signInForm: any;
  signUpForm: any;

  constructor(private afAuth: AngularFireAuth,
              private toastService: ToastService,
              private userService: UserService,
              public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public formBuilder: FormBuilder) {


    this.signInForm = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
    });

    this.signUpForm = formBuilder.group({
      nickname: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Zа-яА-Я0-9\-\_\$\#\@ ]*'), Validators.required])],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
    });

    this.segment = 'signIn';
  }

  signUp() {
    if(this.signUpForm.valid) {
      this.showLoader();
      return this.afAuth.auth.createUserWithEmailAndPassword(this.userSignUpEmail, this.userSignUpPassword)
        .then((res) => {
          console.log(res);
          let name = this.userSignUpNickname;
          let email = res.email;
          let uid = res.uid;
          this.userService.createUser({uid, name, email})
            .subscribe((result) => {
              console.log(result);
              this.loading.dismiss();
              return this.navCtrl.push(HomePage);
            })
        })
        .catch((err) => {
          this.toastService.showToast('error-toast', err.message);
          console.error('Im catch', err);
          this.loading.dismiss();
          return false;
        })
    } else {
      return false;
    }
  }

  signIn() {
    if(this.signInForm.valid) {
      this.showLoader();
      return this.afAuth.auth.signInWithEmailAndPassword(this.userSignInEmail, this.userSignInPassword)
        .then((res) => {
          console.log(res);
          this.loading.dismiss();
          return this.navCtrl.push(HomePage);
        })
        .catch((err) => {
          this.toastService.showToast('error-toast', err.message);
          this.loading.dismiss();
          console.error('Im catch', err);
          return false;
        })
    }
    return false;
  }

  providerSignIn(provider) {
    this.showLoader();
    return this.afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        return this.userService.getUser(res.user.uid)
          .take(1)
          .subscribe((response) => {
            if (response.uid) {
              return this.navCtrl.push(HomePage);
            }
            let name = res.user.displayName;
            let email = res.user.email;
            let uid = res.user.uid;
            return this.userService.createUser({uid, name, email})
              .take(1)
              .subscribe((result) => {
                this.loading.dismiss();
                return this.navCtrl.push(HomePage);
              })
          })
      });
  }

  signInWithFacebook() {
    let provider = new firebase.auth.FacebookAuthProvider();
    return this.providerSignIn(provider);
  }

  signInWithGoogle() {
    let provider = new firebase.auth.GoogleAuthProvider();
    return this.providerSignIn(provider);
  }

  signOut() {
    this.afAuth.auth.signOut();
  }

  showLoader(){
    this.loading = this.loadingCtrl.create({
      content: 'Authenticating...',
      dismissOnPageChange: true
    });

    this.loading.present();
  }
}
