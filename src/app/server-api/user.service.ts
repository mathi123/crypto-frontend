import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';
import { User } from '../models/user';


@Injectable()
export class UserService {
 
  constructor(private httpClient: HttpClient, private config: ConfigurationService) { }

  create(user: User) {
    return this.httpClient.post(`${this.config.getBaseUrl()}/user`, user);
  }
}
