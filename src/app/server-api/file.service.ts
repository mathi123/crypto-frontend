import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FileService {
  private cache: any;

  constructor(private httpClient: HttpClient, private config: ConfigurationService) {
    this.cache = {};
  }

  readById(id: string): Observable<string> {
    const cached = this.cache[id] as string;
    if (cached !== undefined) {
      return Observable.from(Observable.of(cached));
    }
    return this.httpClient
      .get<string>(`${this.config.getApiUrl()}/file/${id}`, this.config.getHttpOptions())
      .do(r => this.cache[id] = r);
  }
}
