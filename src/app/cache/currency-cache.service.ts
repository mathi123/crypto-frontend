import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';

import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { hasCache } from './hasCache.interface';
import { CacheSubject } from './cache-subject';
import { Currency } from '../models/currency';
import { CurrencyService } from '../server-api/currency.service';

@Injectable()
export class CurrencyCacheService implements hasCache {
    private cache: CacheSubject<Currency[]> = new CacheSubject<Currency[]>([]);

    constructor(private currencyService: CurrencyService) { }

    getCurrencies():BehaviorSubject<Currency[]>{
        if(!this.cache.isInitialized){
            this.reloadCache();
        }

        return this.cache;
    }

    reloadCache() {
        this.cache.isInitialized = true;
        this.currencyService.read()
            .subscribe(currencies => this.cache.next(currencies),
                (err) => this.handleError(err));

    }
    
    clearCache() {
        this.cache.next([]);
        this.cache.isInitialized = false;
    }

    private handleError(err){
        console.error(err);
    }
}
