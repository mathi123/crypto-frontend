import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {ConfigurationService} from './configuration.service';
import {Account} from '../models/account';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AccountService {

    constructor(private httpClient: HttpClient, private config: ConfigurationService) {
    }

    read(): Observable<Account[]> {
        return this.httpClient.get<Account[]>(`${this.config.getApiUrl()}/account`, this.config.getHttpOptions());
    }

    readById(id: string): Observable<Account> {
        return this.httpClient.get<Account>(`${this.config.getApiUrl()}/account/${id}`, this.config.getHttpOptions());
    }

    delete(id: string) {
        return this.httpClient.delete(`${this.config.getApiUrl()}/account/${id}`, this.config.getHttpOptions());
    }

    update(record: Account) {
        return this.httpClient.put(`${this.config.getApiUrl()}/account/${record.id}`, record, this.config.getHttpOptions());
    }

    validate(coinId: string, address: string): Observable<Object> {
        const httpParams = new HttpParams()
            .set('coinId', coinId)
            .set('address', address);
        return this.httpClient.get(`${this.config.getApiUrl()}/account/validate`, {
            headers: this.config.getHeaders(),
            params: httpParams
        });
    }

    /**
     * Create a new Account, returns an Observable containing the account id stripped from the Location header.
     * @param {Account} record
     * @returns {Observable<string>}
     */
    create(record: Account): Observable<string> {
        return this.httpClient.post(`${this.config.getApiUrl()}/account`, record, {
            headers: this.config.getHeaders(),
            observe: 'response',
            responseType: 'text'
        }).map(resp => resp.headers.get('Location'))
            .map(url => url.substr(url.length - 36));
    }
}
