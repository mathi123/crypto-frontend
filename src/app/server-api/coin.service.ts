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
    return this.httpClient.get<Coin[]>(`${this.config.getApiUrl()}/coin`, this.config.getHttpOptions());
  }

  readById(id: string) {
    return this.httpClient.get<Coin>(`${this.config.getApiUrl()}/coin/${id}`, this.config.getHttpOptions());
  }

  delete(id: string){
    return this.httpClient.delete(`${this.config.getApiUrl()}/coin/${id}`, this.config.getHttpOptions());
  }

  update(coin: Coin){
    return this.httpClient.put(`${this.config.getApiUrl()}/coin/${coin.id}`, coin, this.config.getHttpOptions());
  }

  updateImage(coinId: string, imageData: string){
    return this.httpClient.put(`${this.config.getApiUrl()}/coin/${coinId}/image`, { data: imageData}, this.config.getHttpOptions());
  }

  create(coin: Coin){
    return this.httpClient.post(`${this.config.getApiUrl()}/coin`, coin,  {
      headers: this.config.getHeaders(),
      observe: "response"
    }).map(resp => resp.headers.get('Location'))
      .map(url => url.substr(url.length - 36));
  }

  importErc20Coin(coin: Coin){
    return this.httpClient.post(`${this.config.getApiUrl()}/coin/${coin.id}/import-erc20`, {}, this.config.getHttpOptions());
  }

  importErc20(){
    return this.httpClient.post(`${this.config.getApiUrl()}/coin/import-erc20`, {}, this.config.getHttpOptions());
  }
}
