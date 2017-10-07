import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';
import { User } from '../models/user';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class MenuService {
  public MenuIsOpenSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  constructor(private config: ConfigurationService) { }

  opened(){
    this.MenuIsOpenSubject.next(true);
  }
  closed(){
    this.MenuIsOpenSubject.next(false);
  }
}
