import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FileService {
 
  constructor(private httpClient: HttpClient, private config: ConfigurationService) { }

  readById(id: string) : Observable<string>{
    return this.httpClient.get<string>(`${this.config.getApiUrl()}/file/${id}`, this.config.getHttpOptions());
  }

}
