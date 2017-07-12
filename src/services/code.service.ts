import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import 'rxjs/add/operator/toPromise';

import { Code } from '../app/code';

@Injectable()
export class CodeService {
  constructor(private db: AngularFireDatabase) {}

  /**
   * Method for getting code object from database by code string
   * @param id
   * @returns {Promise<any>}
   */
  getCode(string: string): any {
    return this.db.list('/codes', {
      query : {
        equalTo: {
          value: string, key: string
        }
      }
    }).toPromise();
  }

  private handlerError(error: any): Promise<any> {
    console.error('An error occured', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
