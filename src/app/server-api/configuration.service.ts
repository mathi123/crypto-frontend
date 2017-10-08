import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Context } from "../models/context";
import { HttpClient } from "@angular/common/http";
import 'rxjs/add/operator/do';

@Injectable()
export class ConfigurationService {
  private _baseUrl = 'http://localhost:3000';
  private _headers: HttpHeaders = new HttpHeaders();
  private _token: string;
    
  public TOKENHEADER = 'Authorization';

  public LoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public UserContext: BehaviorSubject<Context> = new BehaviorSubject<Context>(new Context());

  public constructor(private httpClient: HttpClient) {
    this._headers.append('Content-Type', 'application/json');
  }

  public getBaseUrl(): string {
    return `${this._baseUrl}/api`;
  }

  public setToken(token: string) {
    this._token = token;
    this.addTokenToHeaders();   

    this.loadContext();
    this.LoggedInSubject.next(true);
  }

  private loadContext(){
    console.log("loading context");
    this.httpClient.get<Context>(`${this.getBaseUrl()}/context`, this.getHttpOptions())
      .subscribe(c => this.UserContext.next(c));
  }

  private addTokenToHeaders() {
    if (this._headers.has(this.TOKENHEADER)) {
      this._headers = this._headers.delete(this.TOKENHEADER);
    }
    this._headers = this._headers.set(this.TOKENHEADER, this._token);
    console.log(this._headers);
    console.log(this._token);
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
