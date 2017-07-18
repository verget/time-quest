import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Thenable } from "firebase/app";

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { Observable } from "rxjs/Observable";

import { User } from '../app/user';
import { HttpResponse } from '../app/http-response';

import { config } from '../environments/environment';

@Injectable()
export class UserService {

  currentUserObject: User;

  constructor(private db: AngularFireDatabase,
              private http: Http) {
    this.currentUser.subscribe((userObject) => {
      console.log(userObject);
      this.currentUserObject = userObject;
    })
  }

  /**
   * getUser function
   * @param $key
   * @returns {Promise<User>}
   */

  getUser($key: string): FirebaseObjectObservable<User> {
    return this.db.object('/users/'+$key);
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
  useCode(codeString: string): Observable<HttpResponse> {
    return this.http
      .post(config.apiUrl + '/useCode', {
        codeString: codeString,
        userKey: this.currentUserObject.$key,
      })
      .map(res => res.json());
  }

  /**
   * Return current user observable
   * @returns {FirebaseObjectObservable<User>}
   */
  get currentUser():FirebaseObjectObservable<User> {
    return this.getUser('-Kp-5ifqN1-ooUeQaf9t'); //todo use local storage
  }

  private handlerError(error: any): Promise<any> {
    console.error('An error occured', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
