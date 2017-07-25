import { Injectable } from '@angular/core';

@Injectable()
export class ToolsService {
  constructor() {}

  getObjectValues(object): Array<any> {
    let values = [];
    for (let key in object) {
      values.push(object[key]);
    }
    return values;
}

  isInObjectValues(object: {}, needle: any):boolean {
    let values = this.getObjectValues(object);
    return Boolean(values.find((el) => el === needle));
  }
}
