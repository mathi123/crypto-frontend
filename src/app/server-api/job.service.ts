import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';
import { Observable } from 'rxjs/Observable';
import { CountResult } from '../models/count-result';
import { HttpResponse } from '@angular/common/http';
import { Job } from '../models/job';

@Injectable()
export class JobService {
 
  constructor(private httpClient: HttpClient, private config: ConfigurationService) { }

  public read(offset: number, limit: number) : Observable<CountResult<Job>>{
    let url = `${this.config.getApiUrl()}/job?offset=${offset}&limit=${limit}`;
    let options = this.config.getHttpOptions() as any;
    options.observe = 'response';

    return this.httpClient.get<Job[]>(url, options)
      .map((response: HttpResponse<Job[]>) => new CountResult<Job>(response.body, parseInt(response.headers.get('X-Total-Count'))));
  }

  public readById(id: string) : Observable<Job>{
    return this.httpClient.get<Job>(`${this.config.getApiUrl()}/job/${id}`, this.config.getHttpOptions());
  }
}
