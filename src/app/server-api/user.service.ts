import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ConfigurationService} from './configuration.service';
import {User} from '../models/user';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UserService {

    constructor(private httpClient: HttpClient,
                private config: ConfigurationService) {
    }

    create(user: User): Observable<object> {
        return this.httpClient.post(`${this.config.getApiUrl()}/user`, user, {
            responseType: 'text', observe: 'response'
        });
    }

    read() {
        return this.httpClient.get<User[]>(`${this.config.getApiUrl()}/user`, this.config.getHttpOptions());
    }

    readById(id: string) {
        return this.httpClient.get<User>(`${this.config.getApiUrl()}/user/${id}`, this.config.getHttpOptions());
    }

    update(user: User) {
        return this.httpClient.put<User>(`${this.config.getApiUrl()}/user/${user.id}`, user, this.config.getHttpOptions());
    }

    validateEmail(email: string): Observable<object> {
        const httpParams = new HttpParams().set('email', email);
        return this.httpClient.get(`${this.config.getApiUrl()}/user/validate`, {
            observe: 'response',
            params: httpParams
        });
    }
}
