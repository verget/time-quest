import { Injectable } from '@angular/core';
import { Headers, Http }  from '@angular/http';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';


import 'rxjs/add/operator/toPromise';

import { User } from '../app/user';

@Injectable()
export class UserService {

  private usersUrl = 'api/users';  // URL to web api
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private db: AngularFireDatabase) {}

  /**
   * getUser function
   * @param id
   * @returns {Promise<User>}
   */
  getUser(id: number): FirebaseObjectObservable<User> {
    return this.db.object('/users/${id}');
  }

  getUsers(): FirebaseListObservable<any[]> {
    return this.db.list('/users');
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
