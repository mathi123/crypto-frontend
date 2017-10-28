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

  public read(offset: number, limit: number, level: string, jobId: string = null) : Observable<CountResult<Log>>{
    let url = `${this.config.getApiUrl()}/log?offset=${offset}&limit=${limit}&type=${level}`;

    if(jobId !== null && jobId !== undefined){
      url += `&jobId=${jobId}`;
    }

    let options = this.config.getHttpOptions() as any;
    options.observe = 'response';

    return this.httpClient.get<Log[]>(url, options)
      .map((response: HttpResponse<Log[]>) => new CountResult<Log>(response.body, parseInt(response.headers.get('X-Total-Count'))));
  }

  public readById(id: string) : Observable<Log>{
    return this.httpClient.get<Log>(`${this.config.getApiUrl()}/log/${id}`, this.config.getHttpOptions());
  }
}
