import { Injectable } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { AccountSummary } from '../models/account-summary';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AccountSummaryService {
  constructor(private httpClient: HttpClient, private config: ConfigurationService) { }
  
  read() : Observable<AccountSummary[]>{
    return this.httpClient.get<AccountSummary[]>(`${this.config.getApiUrl()}/account-summary`, this.config.getHttpOptions());
  }
}
