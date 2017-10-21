import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';
import { Tag } from '../models/tag';

@Injectable()
export class TagService {
 
  constructor(private httpClient: HttpClient, private config: ConfigurationService) { }

  read() {
    return this.httpClient.get<Tag[]>(`${this.config.getApiUrl()}/tag`, this.config.getHttpOptions());
  }

  readById(id: string) {
    return this.httpClient.get<Tag>(`${this.config.getApiUrl()}/tag/${id}`, this.config.getHttpOptions());
  }

  delete(id: string){
    return this.httpClient.delete(`${this.config.getApiUrl()}/tag/${id}`, this.config.getHttpOptions());
  }

  update(record: Tag){
    return this.httpClient.put(`${this.config.getApiUrl()}/tag/${record.id}`, record, this.config.getHttpOptions());
  }

  create(record: Tag){
    return this.httpClient.post(`${this.config.getApiUrl()}/tag`, record, this.config.getHttpOptions());
  }
}
