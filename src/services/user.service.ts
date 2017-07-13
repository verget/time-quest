import { Injectable } from '@angular/core';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Thenable } from "firebase/app";

import 'rxjs/add/operator/toPromise';

import { CodeService } from "./code.service";

import { User } from '../app/user';
import { Code } from '../app/code';


@Injectable()
export class UserService {

  currentUserObject: User;

  constructor(private db: AngularFireDatabase,
              private codeService: CodeService) {
    this.currentUser.subscribe((userObject) => {
      this.currentUserObject = userObject;
    })
  }

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
   * Update user function
   * @param id
   * @param newObject
   * @returns {firebase.Thenable<any>}
   */
  updateUser(id: number, newObject: User): Thenable<boolean> {
    return this.getUser(id).update(newObject)
      .then(() => Promise.resolve())
      .catch(this.handlerError);
  }

  useCode(codeObject: Code): Thenable<boolean> {
    console.log(codeObject);
    console.log(this.currentUserObject);
    this.currentUserObject.endTime =+ codeObject.cost;
    console.log(this.currentUserObject);
    this.currentUserObject.usedCodes.push(codeObject.id);
    return this.updateUser(this.currentUserObject.id,  this.currentUserObject);
  }

  get currentUser():FirebaseObjectObservable<User> {
    return this.getUser(0);
  }

  private handlerError(error: any): Promise<any> {
    console.error('An error occured', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
