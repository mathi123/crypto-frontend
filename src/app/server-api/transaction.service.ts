import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';
import { Observable } from 'rxjs/Observable';
import { Transaction } from '../models/transaction';

@Injectable()
export class TransactionService {
  constructor(private httpClient: HttpClient, private config: ConfigurationService) { }

  read(accountId: string) : Observable<Transaction[]>{
    return this.httpClient.get<Transaction[]>(`${this.config.getApiUrl()}/account/${accountId}/transaction`, this.config.getHttpOptions());
  }

  readById(accountId: string, id: string) : Observable<Transaction>{
    return this.httpClient.get<Transaction>(`${this.config.getApiUrl()}/account/${accountId}/transaction/${id}`,
      this.config.getHttpOptions());
  }

  delete(record: Transaction){
    return this.httpClient.delete(`${this.config.getApiUrl()}/account/${record.accountId}/transaction/${record.id}`,
      this.config.getHttpOptions());
  }

  update(record: Transaction){
    return this.httpClient.put(`${this.config.getApiUrl()}/account/${record.accountId}/${record.id}`,
      record, this.config.getHttpOptions());
  }

  create(record: Transaction):Observable<string>{
    return this.httpClient.post(`${this.config.getApiUrl()}/account/${record.accountId}`, record, {
      headers: this.config.getHeaders(),
      observe: 'response'
    }).map((resp: any) => resp.headers.get('Location'));
  }
}
