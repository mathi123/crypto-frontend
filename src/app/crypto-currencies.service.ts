import { Injectable } from '@angular/core';
import { Currency } from "./currency";
import {HttpClient} from '@angular/common/http';
import { Observable } from "rxjs/Observable";

@Injectable()
export class CryptoCurrenciesService {

  constructor(private httpClient: HttpClient) { }

  public getCurrencies() : Observable<Currency[]>{
    return this.httpClient.get<Currency[]>('assets/currencies.json')
    ;
  }
}
