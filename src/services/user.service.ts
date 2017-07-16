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

  getUsers(): FirebaseListObservable<any[]> {
    return this.db.list('/users');
  }

  /**
   * Update user function
   * @param $key
   * @param newObject
   * @returns {firebase.Thenable<any>}
   */
  updateUser($key: string, newObject: User): Thenable<boolean> {
    console.log(newObject);
    return this.getUser($key).update(newObject)
      .then(() => Promise.resolve())
      .catch(this.handlerError);
  }

  useCode(codeString: string): Observable<HttpResponse> {
    console.log(codeString);
    return this.http
      .post(config.apiUrl + '/useCode', {
        codeString: codeString,
        userKey: this.currentUserObject.$key,
      })
      .map(res => res.json());
  }

  get currentUser():FirebaseObjectObservable<User> {
    return this.getUser('-Kp-5ifqN1-ooUeQaf9t');
  }

  private handlerError(error: any): Promise<any> {
    console.error('An error occured', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
