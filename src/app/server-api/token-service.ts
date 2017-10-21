import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';
import { Credentials } from '../models/credentials';
import 'rxjs/add/operator/do';
import { Router } from '@angular/router';
import { SocketManagerService } from '../server-socket/socket-manager.service';

@Injectable()
export class TokenService {
  private redirectUrl:string = '/home';

  constructor(private httpClient: HttpClient, private config: ConfigurationService,
     private router:Router, private feedback: SocketManagerService) { }

  login(credentials: Credentials) {
    return this.httpClient.post(`${this.config.getApiUrl()}/token`, credentials,  {observe: 'response'})
        .do(resp => this.setToken(resp))
        .do(resp => this.openSocket())
        .do(resp => this.router.navigateByUrl(this.redirectUrl))
        .map(p => true);
  }

  setRedirectUrl(url){
    this.redirectUrl = url;
  }

  openSocket(){
    console.log("initializing socket");
    this.feedback.init();
  }

  setToken(resp){
    let token = resp.headers.get('Authorization');

    console.log(token);

    this.config.setToken(token);
  }
}
