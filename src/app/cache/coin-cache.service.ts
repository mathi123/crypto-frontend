import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/user';
import {Coin} from '../models/coin';

import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import {Observable} from 'rxjs/Observable';
import {hasCache} from './hasCache.interface';
import {CacheSubject} from './cache-subject';
import {CoinService} from '../server-api/coin.service';

@Injectable()
export class CoinCacheService implements hasCache {
    private cache: CacheSubject<Coin[]> = new CacheSubject<Coin[]>([]);

    constructor(private coinService: CoinService) {
    }

    getCoins(): BehaviorSubject<Coin[]> {
        if (!this.cache.isInitialized) {
            this.reloadCache();
        }

        return this.cache;
    }

    reloadCache() {
        this.cache.isInitialized = true;
        this.coinService.read()
            .subscribe(coins => this.cache.next(coins),
                (err) => this.handleError(err));

    }

    clearCache() {
        this.cache.next([]);
        this.cache.isInitialized = false;
    }

    private handleError(err) {
        console.error(err);
    }
}
