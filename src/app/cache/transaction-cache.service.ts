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
import { Transaction } from '../models/transaction';
import { TransactionService } from '../server-api/transaction.service';
import { AccountCacheService } from './account-cache.service';
import { Dictionary } from '../models/dictionary';

@Injectable()
export class TransactionCacheService implements hasCache{
    private cache: Dictionary<TransactionCache> = {};
    
    constructor(private transactionsService: TransactionService, 
        private accountCacheService: AccountCacheService) { 
            this.accountCacheService.getCache()
                .subscribe(acc=> this.accountsUpdated(acc));
    }  

    private accountsUpdated(accounts: Account[]){
        for(let account of accounts){
            this.createCacheIfNotExists(account.id);
        }

        // Todo: check deleted accounts
    }

    private createCacheIfNotExists(accountId: string):TransactionCache{
        if(this.cache[accountId] === undefined){
            let accountCache = new TransactionCache();
            accountCache.isInitialized = false;
            accountCache.accountId = accountId;
            this.cache[accountId] = accountCache;
        }

        return this.cache[accountId];
    }

    public getTransactions(accountId: string):BehaviorSubject<Transaction[]>{
        let accountCache = this.createCacheIfNotExists(accountId);

        if(!accountCache.isInitialized){
            this.reloadCacheInstance(accountCache);
        }

        return accountCache;
    }

    public reloadCache(){
        // ToDo: implement
    }

    public reloadCacheForAccount(accountId: string){
        if(this.cache[accountId] !== undefined){
            this.reloadCacheInstance(this.cache[accountId]);
        }
    }

    public reloadCacheInstance(cache : TransactionCache){
        console.log("reloading cache instance");
        cache.isInitialized = true;
        this.transactionsService.read(cache.accountId)
            .subscribe(transactions => cache.next(transactions));
    }

    public clearCache(){
    }

    private handleError(err){
        console.error(err);
    }
}

export class TransactionCache extends CacheSubject<Transaction[]>{
    accountId: string;

    constructor(){
        super([]);
    }
}