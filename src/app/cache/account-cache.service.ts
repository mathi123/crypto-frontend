import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { Account } from '../models/account';
import { AccountService } from '../server-api/account.service';

import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { hasCache } from './hasCache.interface';
import { CacheSubject } from './cache-subject';

@Injectable()
export class AccountCacheService implements hasCache{
    private cache: CacheSubject<Account[]> = new CacheSubject<Account[]>([]);

    constructor(private accountService: AccountService) { }  

    public getAccounts():BehaviorSubject<Account[]>{
        if(!this.cache.isInitialized){
            this.reloadCache();
        }

        return this.cache;
    }

    public reloadCache(){
        this.cache.isInitialized = true;
        this.accountService.read()
            .subscribe(accounts => this.cache.next(accounts),
                err => this.handleError(err));
    }

    public clearCache(){
        this.cache.next([]);
        this.cache.isInitialized = false;
    }

    public addAccount(account: Account) : Observable<Account>{
        return this.accountService.create(account)
            .flatMap((id) => this.readAndAdd(id));
    }

    private readAndAdd(id: string) : Observable<Account>{
        return this.accountService.readById(id)
            .do(
                account => this.addAccountToCache(account),
                err => this.handleError(err));
    }

    private addAccountToCache(account: Account){
        let existing = this.cache.value;
        existing.push(account);
        this.cache.next(existing);
    }

    private handleError(err){
        console.error(err);
    }
}
