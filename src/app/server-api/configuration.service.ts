import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class ConfigurationService {
  private _baseUrl = 'http://localhost:3000';
  private _headers: HttpHeaders = new HttpHeaders();
  private _options: any = {};
  private _token: string;
  public TOKENHEADER = 'Authorization';

  public LoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public constructor() {
    this._headers.append('Content-Type', 'application/json');
    this._options.headers = this._headers;
  }

  public getBaseUrl(): string {
    return `${this._baseUrl}/api`;
  }

  public getHttpOptions(): any {
    return this._options;
  }

  public setToken(token: string) {
    this._token = token;
    this.addTokenToHeaders();
    this.LoggedInSubject.next(true);
  }

  private addTokenToHeaders() {
    if (this._headers.has(this.TOKENHEADER)) {
      this._headers.delete(this.TOKENHEADER);
    }
    this._headers.append(this.TOKENHEADER, this._token);
  }

  public getHeaders():HttpHeaders{
    return this._headers;
  }
}
