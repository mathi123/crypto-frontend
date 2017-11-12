import { Injectable } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FileCacheService {


  constructor(private httpClient: HttpClient, private config: ConfigurationService) { }
  
  read(id: string) : Observable<string>{
    // Todo: cache result
    return this.httpClient.get<string>(`${this.config.getApiUrl()}/file/${id}`, this.config.getHttpOptions());
  }
}
