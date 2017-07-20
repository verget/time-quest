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
import {Subscription} from "rxjs";

@Injectable()
export class UserService {

  currentUser: FirebaseListObservable<any>;

  constructor(private db: AngularFireDatabase,
              private afAuth: AngularFireAuth,
              public events: Events,
              private http: Http) {

    console.log('im service');
    this.currentUser = this.getCurrentUser();
    // this.afAuth.authState.subscribe(user => {
    //   console.log('im service subscribe');
    //   console.log(user);
    //   if (user) {
    //     this.currentUser = this.getUser(user.uid);
    //     return;
    //   }
    //   this.events.publish('user:logout');
    // });
  }

  /**
   * getUser function
   * @param $key
   * @returns {Promise<User>}
   */

  getUser(uid: string): FirebaseListObservable<any> {
    console.log(uid);
    return this.db.list('/users', {
      query: {
        orderByChild: 'uid',
        equalTo: uid
      }
    });
  }

  getCurrentUser(): any {
    return this.afAuth.authState.subscribe(user => {
      if (user) {
        return this.getUser(user.uid);
      }
      throw 'error auth';
    });
  }

  createUser(userObject: any): Observable<HttpResponse> {
    return this.http
      .put(config.apiUrl + '/createUser', {
        name: userObject.name,
        $key: userObject.$key,
        email: userObject.email
      })
      .map(res => res.json());
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
    return this.events.publish('user:logout');
  }

  private handlerError(error: any): Promise<any> {
    console.error('An error occured', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
