import { Injectable } from '@angular/core';
import { Headers, Http }  from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User } from '../app/user';

@Injectable()
export class UserService {

  private usersUrl = 'api/users';  // URL to web api
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {}

  /**
   *
   * @param id
   * @returns {Promise<any>}
   */
  getUser(id: number): Promise<User> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data as User)
      .catch(this.handlerError);
  }

  getUsers(): Promise<User[]> {
    return this.http.get(this.usersUrl)
      .toPromise()
      .then(response => response.json().data as User[])
      .catch(this.handlerError)
  }

  private handlerError(error: any): Promise<any> {
    console.error('An error occured', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
