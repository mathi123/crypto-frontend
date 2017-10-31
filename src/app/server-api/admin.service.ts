import { Injectable } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AdminStatistics } from '../models/admin-statistics';

@Injectable()
export class AdminService {

  constructor(private httpClient: HttpClient, private config: ConfigurationService) { }

  read() : Observable<AdminStatistics>{
    return this.httpClient.get<AdminStatistics>(`${this.config.getApiUrl()}/admin/statistics`, this.config.getHttpOptions());
  }

}
