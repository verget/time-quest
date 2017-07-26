import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http } from "@angular/http";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { Code } from '../app/code';
import { HttpResponse } from '../app/http-response';

import { config } from '../environments/environment';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take'

@Injectable()
export class CodeService {
  constructor(private db: AngularFireDatabase,
              private http: Http) {}

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

  /**
   *
   * @param data
   * @returns {Observable<R>}
   */
  createCode(data: Code): Observable<HttpResponse> {
    return this.http
      .put(config.apiUrl + '/createCode', {
        codeString: data.string,
        codeCost: data.cost
      })
      .map(res => res.json());
}

  /**
   * change code function
   * @param data
   * @returns {Observable<R>}
   */
  changeCode(data: Code): Observable<HttpResponse> {
    return this.http
      .post(config.apiUrl + '/changeCode', {
        codeString: data.string,
        codeCost: data.cost,
        codeKey: data.$key
      })
      .map(res => res.json());
  }

  /**
   * Delete Code
   * @param codeKey
   * @returns {Observable<R>}
   */
  deleteCode(codeKey: string): Observable<HttpResponse> {
    return this.http
      .delete(config.apiUrl + '/deleteCode?key=' + codeKey)
      .map(res => res.json());
  }

  getCodeListObservable(): FirebaseListObservable<[Code]> {
    return this.db.list('codes');
  }

  private handlerError(error: any): Promise<any> {
    console.error('An error occured', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
