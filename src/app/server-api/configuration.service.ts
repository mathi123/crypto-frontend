import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Context } from "../models/context";
import { HttpClient } from "@angular/common/http";
import 'rxjs/add/operator/do';
import { environment } from '../../environments/environment';

@Injectable()
export class ConfigurationService {
  private _baseUrl = environment.url;
  private _headers: HttpHeaders = new HttpHeaders();
  private token: string;
    
  public TOKENHEADER = 'Authorization';

  public LoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public UserContext: BehaviorSubject<Context> = new BehaviorSubject<Context>(new Context());

  public constructor(private httpClient: HttpClient) {
    this._headers.append('Content-Type', 'application/json');
  }

  public getBaseUrl(){
    return this._baseUrl;
  }

  public getApiUrl(): string {
    return `${this._baseUrl}/api`;
  }

  public logOut(){
    this.token = null;
    this._headers = new HttpHeaders();
    this.LoggedInSubject.next(false);
  }

  public setToken(token: string) {
    this.token = token;
    this.addTokenToHeaders();   

    this.loadContext();
    this.LoggedInSubject.next(true);
  }

  public getBearerToken(){
    return this.token.substr('Bearer '.length);
  }

  private loadContext(){
    console.log("loading context");
    this.httpClient.get<Context>(`${this.getApiUrl()}/context`, this.getHttpOptions())
      .subscribe(c => this.UserContext.next(c));
  }

  private addTokenToHeaders() {
    if (this._headers.has(this.TOKENHEADER)) {
      this._headers = this._headers.delete(this.TOKENHEADER);
    }
    this._headers = this._headers.set(this.TOKENHEADER, this.token);
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
