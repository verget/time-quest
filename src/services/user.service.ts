import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { Observable } from "rxjs/Observable";

import { User } from '../app/user';
import { HttpResponse } from '../app/http-response';

import { config } from '../environments/environment';

@Injectable()
export class UserService {

  currentLocalUser: Observable<User>;

  constructor(private afAuth: AngularFireAuth,
              private db: AngularFireDatabase,
              private http: Http) {

    this.currentLocalUser = new Observable(observer => {
      return afAuth.authState.subscribe(user => {
        if (user) {
          return this.getUser(user.uid).subscribe((localUser) => {
            observer.next(localUser);
          });
        } else {
          observer.complete();
        }
      })
    });
  }

  getAuthenticated(): Observable<any> {return this.afAuth.authState};

  /**
   * getUser function
   * @param uid
   * @returns {Promise<User>}
   */

  getUser(uid: string): Observable<User> {
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
      .catch((error:any) => Observable.throw(JSON.parse(error._body).error || 'Server error'));
  }

  deleteUser(uid: string): Observable<HttpResponse> {
    return this.http
      .delete(config.apiUrl + '/user/' + uid)
      .map(res => res.json())
      .catch((error:any) => Observable.throw(JSON.parse(error._body).error || 'Server error'));
  }

  changeUserTime(uid: string, endTime: number): Observable<HttpResponse> {
    return this.http
      .post(config.apiUrl + '/changeUserTime', {
        endTime: endTime,
        userUid: uid
      })
      .map(res => res.json())
      .catch((error:any) => Observable.throw(JSON.parse(error._body).error || 'Server error'));
  }

  /**
   * Save device token to db after user auth
   * @param token
   * @param uid
   * @returns {Observable<R>}
   */
  saveNotificationToken(token: string, uid: string): Observable<HttpResponse> {
    return this.http.put(config.apiUrl + '/token', {
      userUid: uid,
      token: token
    })
    .map((res) => res.json())
    .catch((error:any) => Observable.throw(JSON.parse(error._body).error || 'Server error'));
  }

  /**
   * Send notification to all user devices
   * @param uid
   * @param messageText
   * @returns {Observable<R>}
   */
  sendNotificationToUser(uid: string, messageText: string): Observable<HttpResponse> {
    return this.http.post(config.apiUrl + '/sendNotification', {
      userUid: uid,
      messageText: messageText
    })
      .map((res) => res.json())
      .catch((error:any) => Observable.throw(JSON.parse(error._body).error || 'Server error'));
  }

  /**
   * This function need for create user object in intair database after users auth
   * @param userObject
   * @returns {Observable<R|T>}
   */
  createUser(userObject: any): Observable<HttpResponse> {
    return this.http
      .put(config.apiUrl + '/user', {
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
  getUserListObservable(): Observable<[User]> {
    return this.db.list('/users').map( res => {
      let array = [];
      res.forEach((user) => {
        user.formatedEndTime = new Date(user.endTime*1).toISOString();
        array.push(user);
      });
      return array;
    })
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
        userUid: userUid
      })
      .map(res => res.json())
      .catch((error:any) => Observable.throw(JSON.parse(error._body).error || 'Server error'));
  }

  /**
   * Log out function
   * @returns {firebase.Promise<any>}
   */
  logOut():void {
    this.afAuth.auth.signOut();
  }

  private handlerError(error: any): Promise<any> {
    console.error('An error occured', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
