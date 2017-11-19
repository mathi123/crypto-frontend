import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpClient} from '@angular/common/http';
import {Account} from '../models/account';
import {AccountService} from '../server-api/account.service';

import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import {Observable} from 'rxjs/Observable';
import {hasCache} from './hasCache.interface';
import {CacheSubject} from './cache-subject';

@Injectable()
export class AccountCacheService implements hasCache {
    private cache: CacheSubject<Account[]> = new CacheSubject<Account[]>([]);

    constructor(private accountService: AccountService) {
    }

    /// return cache observable
    public getCache(): CacheSubject<Account[]> {
        return this.cache;
    }

    /// return cache observable, start getting items
    public getAccounts(): BehaviorSubject<Account[]> {
        if (!this.cache.isInitialized) {
            this.reloadCache();
        }

        return this.cache;
    }

    public reloadCache() {
        this.cache.isInitialized = true;
        this.accountService.read()
            .subscribe(accounts => this.cache.next(accounts),
                err => this.handleError(err));
    }

    public clearCache() {
        this.cache.next([]);
        this.cache.isInitialized = false;
    }

    public getById(id: string): Observable<Account> {
        if (this.cache.isInitialized) {
            const result = this.cache.value.filter(a => a.id === id)[0];
            return Observable.from(Observable.of(result));
        } else {
            return this.readFromServerAndStoreInCache(id);
        }
    }

    public save(account: Account): Observable<object> {
        if (!account.id) {
            return this.accountService.create(account)
                .flatMap((id) => this.readFromServerAndStoreInCache(id));
        } else {
            return this.accountService.update(account);
        }
    }

    public delete(account: Account): Observable<boolean> {
        return this.accountService.delete(account.id)
            .do(() => {
                const clone = this.cache.value;
                clone.splice(clone.indexOf(account), 1)
                this.cache.next(clone);
            }).map(r => true);
    }

    private readFromServerAndStoreInCache(id: string): Observable<Account> {
        return this.accountService.readById(id)
            .do(account => this.addAccountToCache(account),
                err => this.handleError(err));
    }

    private addAccountToCache(account: Account) {
        const existing = this.cache.value;
        existing.push(account);
        this.cache.next(existing);
    }

    private handleError(err) {
        console.error(err);
    }
}
