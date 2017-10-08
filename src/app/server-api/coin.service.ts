import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';
import { User } from '../models/user';
import { Coin } from '../models/coin';


@Injectable()
export class CoinService {
 
  constructor(private httpClient: HttpClient, private config: ConfigurationService) { }

  read() {
    return this.httpClient.get<Coin[]>(`${this.config.getBaseUrl()}/coin`, this.config.getHttpOptions());
  }

  readById(id: string) {
    return this.httpClient.get<Coin>(`${this.config.getBaseUrl()}/coin/${id}`, this.config.getHttpOptions());
  }

  delete(id: string){
    return this.httpClient.delete(`${this.config.getBaseUrl()}/coin/${id}`, this.config.getHttpOptions());
  }

  update(coin: Coin){
    return this.httpClient.put(`${this.config.getBaseUrl()}/coin/${coin.id}`, this.config.getHttpOptions());
  }

  create(coin: Coin){
    return this.httpClient.post(`${this.config.getBaseUrl()}/coin`, this.config.getHttpOptions());
  }
}
