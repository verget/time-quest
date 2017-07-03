import { Injectable } from '@angular/core';
import { Headers, Http }  from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User } from './user';

@Injectable()
export class UserService {

  private heroesUrl = 'api/heroes';  // URL to web api
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {}

  /**
   *
   * @param id
   * @returns {Promise<any>}
   */
  getUser(id: number): Promise<User> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data as User)
      .catch(this.handlerError);
  }

  private handlerError(error: any): Promise<any> {
    console.error('An error occured', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
