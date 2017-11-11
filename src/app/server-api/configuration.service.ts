import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Context } from "../models/context";
import { HttpClient } from "@angular/common/http";
import 'rxjs/add/operator/do';
import { environment } from '../../environments/environment';
import { Logger } from "../logger";

@Injectable()
export class ConfigurationService {
  private _baseUrl = environment.url;
  private _headers: HttpHeaders = new HttpHeaders();
  private token: string;
    
  public TokenHeader = 'Authorization';

  public UserContext: BehaviorSubject<Context> = new BehaviorSubject<Context>(null);

  public constructor(private httpClient: HttpClient, private logger: Logger) {
    this._headers.append('Content-Type', 'application/json');
  }

  public getBaseUrl(){
    return this._baseUrl;
  }

  public getApiUrl(): string {
    return `${this._baseUrl}/api`;
  }

  public logOut(){
    this.logger.verbose('logging out');
    this.token = null;
    this._headers = new HttpHeaders();
    this.UserContext.next(null);
  }

  public setToken(token: string) {
    this.logger.verbose('setting token');
    this.token = token;
    this.addTokenToHeaders();   
  }

  public getBearerToken(){
    return this.token.substr('Bearer '.length);
  }

  public loadContext(){
    this.logger.verbose("loading context");
    this.httpClient.get<Context>(`${this.getApiUrl()}/context`, this.getHttpOptions())
      .subscribe(context => this.UserContext.next(context));
  }

  private addTokenToHeaders() {
    if (this._headers.has(this.TokenHeader)) {
      this._headers = this._headers.delete(this.TokenHeader);
    }
    this._headers = this._headers.set(this.TokenHeader, this.token);
    console.log(this._headers);
    console.log(this.token);
  }

  public getHeaders(){
    return this._headers;
  }
  
  public getHttpOptions(){
    return {
      headers: this._headers
    };
  }
}
