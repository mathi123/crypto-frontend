import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpClient} from '@angular/common/http';
import {ConfigurationService} from './configuration.service';
import {User} from '../models/user';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UserService {

    constructor(private httpClient: HttpClient, private config: ConfigurationService) {
    }

    create(user: User): Observable<object> {
        return this.httpClient.post(`${this.config.getApiUrl()}/user`, user);
    }
}
