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
  loginData = { username:'', password:'' };
  provider: any;

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

  signIn(provider) {
    return this.afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        console.log(res);
        let credential = res.credential;
        let user = res.user;

      });
  }

  signInWithFacebook() {
    let provider = new firebase.auth.FacebookAuthProvider();
    return this.signIn(provider);
  }

  signInWithGoogle() {
    let provider = new firebase.auth.GoogleAuthProvider();
    return this.signIn(provider);
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
