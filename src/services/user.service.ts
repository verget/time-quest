import { Injectable } from '@angular/core';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { CodeService } from "./code.service";

import 'rxjs/add/operator/toPromise';

import { User } from '../app/user';
import { Thenable } from "firebase/app";

@Injectable()
export class UserService {

  constructor(private db: AngularFireDatabase,
              private codeService: CodeService) {}

  /**
   * getUser function
   * @param id
   * @returns {Promise<User>}
   */

  getUser(id: number): FirebaseObjectObservable<User> {
    return this.db.object('/users/'+id);
  }

  getUsers(): FirebaseListObservable<any[]> {
    return this.db.list('/users');
  }

  /**
   * Code send function, will check user's code
   * @param codeString
   * @returns {Promise<boolean>}
   */
  enterCode(codeString): Promise<boolean> {
    return this.codeService.getCode(codeString)
      .then((codeArray) => {
        if (codeArray.length) {
          console.log(codeArray[0].cost);
          return true;
        }
        return false;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  /**
   * Update user function
   * @param id
   * @param newObject
   * @returns {firebase.Thenable<any>}
   */
  updateUser(id: number, newObject: User): Thenable<boolean> {
    return this.getUser(id).update(newObject).then(() => {
      return true;
    }).catch((err) => {
      console.error(err);
      return false;
    })
  }

  get currentUser():FirebaseObjectObservable<User> {
    return this.getUser(0);
  }

  // update(hero: Hero): Promise<Hero> {
  //   const url = `${this.heroesUrl}/${hero.id}`;
  //   return this.http
  //     .put(url, JSON.stringify(hero), {headers: this.headers})
  //     .toPromise()
  //     .then(() => hero)
  //     .catch(this.handlerError);
  // }

  private handlerError(error: any): Promise<any> {
    console.error('An error occured', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
