import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';
import { Log } from '../models/log';
import { Observable } from 'rxjs/Observable';
import { CountResult } from '../models/count-result';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class LogService {
 
  constructor(private httpClient: HttpClient, private config: ConfigurationService) { }

  read(offset: number, limit: number) : Observable<CountResult<Log>>{
    let url = `${this.config.getApiUrl()}/log?offset=${offset}&limit=${limit}`;
    let options = this.config.getHttpOptions() as any;
    options.observe = 'request';

    return this.httpClient.get<Log[]>(url, options)
      .map((response: HttpResponse<Log[]>) => new CountResult<Log>(response.body, parseInt(response.headers.get('X-Total-Count'))));
  }

  readById(id: string) : Observable<Log>{
    return this.httpClient.get<Log>(`${this.config.getApiUrl()}/log/${id}`, this.config.getHttpOptions());
  }
}
