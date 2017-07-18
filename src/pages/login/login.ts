import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  displayName: any;
  loading: any;
  userEmail: string;
  userPassword: string;

  constructor(public navCtrl: NavController,
              private afAuth: AngularFireAuth,
              public authService: AuthService,
              public loadingCtrl: LoadingController,
              private toastCtrl: ToastController) {
    afAuth.authState.subscribe(user => {
      if (!user) {
        this.displayName = null;
        return;
      }
      this.displayName = user.displayName;
    });
  }

  signUp() {
    console.log(this.userEmail);
    console.log(this.userPassword);
    return this.afAuth.auth.createUserWithEmailAndPassword(this.userEmail, this.userPassword)
      .then((res) => {
      console.log(res);
    })
  }

  providerSignIn(provider) {
    return this.afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        console.log(res);
        let credential = res.credential;
        let user = res.user;
        this.loading.dismiss();
      });
  }

  signInWithFacebook() {
    this.showLoader();
    let provider = new firebase.auth.FacebookAuthProvider();
    return this.providerSignIn(provider);
  }

  signInWithGoogle() {
    this.showLoader();
    let provider = new firebase.auth.GoogleAuthProvider();
    return this.providerSignIn(provider);
  }

  signOut() {
    this.afAuth.auth.signOut();
  }

  showLoader(){
    this.loading = this.loadingCtrl.create({
      content: 'Authenticating...'
    });

    this.loading.present();
  }
}
