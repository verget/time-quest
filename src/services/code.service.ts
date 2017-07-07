import { Injectable } from '@angular/core';
import { Headers, Http }  from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Code } from '../app/code';

@Injectable()
export class CodeService {

  private codesUrl = 'api/codes';  // URL to web api
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {}

  /**
   * Method for getting code object from database by code string
   * @param id
   * @returns {Promise<any>}
   */
  getCode(string: string): Promise<[Code]> {
    const url = `${this.codesUrl}/?string=${string}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data as Code)
      .catch(this.handlerError);
  }

  private handlerError(error: any): Promise<any> {
    console.error('An error occured', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
