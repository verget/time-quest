import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take'

import { Code } from '../app/code';

@Injectable()
export class CodeService {
  constructor(private db: AngularFireDatabase) {}

  /**
   * Method for getting code object from database by code string
   * @param id
   * @returns {Promise<any>}
   */
  getCode(string: string): Observable<any> {
    return this.db.list('/codes', {
      query : {
        orderByChild: 'string',
        equalTo: string
      },
      preserveSnapshot: true
    }).take(1);
  }

  private handlerError(error: any): Promise<any> {
    console.error('An error occured', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
