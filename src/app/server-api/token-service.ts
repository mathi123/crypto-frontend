import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';
import { Credentials } from '../models/credentials';
import 'rxjs/add/operator/do';

@Injectable()
export class TokenService {
 
  constructor(private httpClient: HttpClient, private config: ConfigurationService) { }

  login(credentials: Credentials) {
    return this.httpClient.post(`${this.config.getBaseUrl()}/token`, credentials,  {observe: 'response'})
        .do(resp => this.setToken(resp))
        .map(p => true);
  }

  setToken(resp){
    let token = resp.headers.get('Authorization');

    console.log(token);

    this.config.setToken(token);
  }
}
