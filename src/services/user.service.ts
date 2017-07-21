import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Thenable } from "firebase/app";
import { Events } from 'ionic-angular';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { Observable } from "rxjs/Observable";

import { User } from '../app/user';
import { HttpResponse } from '../app/http-response';
import { LoginPage } from '../pages/login/login';

import { config } from '../environments/environment';

@Injectable()
export class UserService {

  currentUserObject: User;
  currentUser: FirebaseObjectObservable<any>;
  // currentLocalUser: FirebaseListObservable<any>;

  constructor(private afAuth: AngularFireAuth,
              private db: AngularFireDatabase,
              public events: Events,
              private http: Http) {

    afAuth.authState.subscribe(user => {
      if (user) {
        this.currentUserObject = this.getUser(user.uid);
      }
    });
  }

  /**
   * getUser function
   * @param uid
   * @returns {Promise<User>}
   */

  getUser(uid: string): any {
    return this.db.list('/users', {
      query: {
        orderByChild: 'uid',
        equalTo: uid
      }
    }).map((res) => {
      if (res.length) {
        return res[0];
      }
      return res;
    })
  }

  setCurrentUser(userObject: any): any {
    this.currentUserObject = userObject;
    this.getUser(userObject.uid).subscribe((userObject) => {
      console.log('======');
      console.log(userObject);
      this.currentUserObject = userObject;
    })
  }

  // getCurrentUser(): any {
  //   return this.afAuth.authState.subscribe(user => {
  //     if (user) {
  //       return this.getUser(user.uid);
  //     }
  //     throw 'error auth';
  //   });
  // }

  saveMessagingToken(token: string):any {
     return this.afAuth.authState.take(1).subscribe((userObject) => {
       console.log('tokenSaving', userObject);
       return this.http.post(config.apiUrl + '/saveToken', {
         userUid: userObject.uid,
         token: token
       })
         .toPromise()
         .then((res) => res.json())
         .catch((err) => err)
     })
  }

  createUser(userObject: any): Observable<HttpResponse> {
    return this.http
      .put(config.apiUrl + '/createUser', {
        name: userObject.name,
        uid: userObject.uid,
        email: userObject.email
      })
      .map(res => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  /**
   * Retun user list observable
   * @returns {FirebaseListObservable<any[]>}
   */
  getUserListObservable(): FirebaseListObservable<[User]> {
    return this.db.list('/users');
  }

  /**
   * Code use function, after execute will add codes cost to current users endTime and
   * save codes key to current users used list
   * @param codeString
   * @returns {Observable<R>}
   */
  useCode(codeString: string, userUid: string): Observable<HttpResponse> {
    return this.http
      .post(config.apiUrl + '/useCode', {
        codeString: codeString,
        userKey: userUid,
      })
      .map(res => res.json());
  }

  /**
   * Return current user observable
   * @returns {FirebaseObjectObservable<User>}
   */
  // get currentUser():FirebaseObjectObservable<User> {
  //   return this.getUser('-Kp-5ifqN1-ooUeQaf9t'); //todo use local storage
  // }

  logOut() {
    return this.afAuth.auth.signOut();
  }

  private handlerError(error: any): Promise<any> {
    console.error('An error occured', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
