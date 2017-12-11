import { Injectable } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FileCacheService {
  private imageCache = {};

  constructor(private httpClient: HttpClient, private config: ConfigurationService) { }

  read(id: string): Observable<string> {
    if (this.imageCache[id] !== undefined) {
      return Observable.from(Observable.of(this.imageCache[id]));
    }else {
      return this.httpClient.get<string>(`${this.config.getApiUrl()}/file/${id}`, this.config.getHttpOptions())
        .do(r => this.imageCache[id] = r);
    }
  }
}
