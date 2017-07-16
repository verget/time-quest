import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Observable, Subscription} from 'rxjs/Rx';
import {FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import { Code } from '../../app/code';
import { User } from '../../app/user';
import {CodeService} from "../../services/code.service";
import {UserService} from "../../services/user.service";


@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html'
})
export class AdminPage implements OnInit{
  segment: string;
  codeList: FirebaseListObservable<[Code]>;
  userList: FirebaseListObservable<[User]>;
  codeStringChange: boolean;

  constructor(private userService: UserService,
              private codeService: CodeService) {}

  ngOnInit(): void {
    this.segment = 'codes';
    this.codeList = this.codeService.getCodeListObservable();
    this.userList = this.userService.getUserListObservable();
    this.codeStringChange = false;
  }
}
