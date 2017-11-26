import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { TagService } from '../server-api/tag.service';

import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { hasCache } from './hasCache.interface';
import { CacheSubject } from './cache-subject';
import { Tag } from '../models/tag';

@Injectable()
export class TagCacheService implements hasCache {
    private cache: CacheSubject<Tag[]> = new CacheSubject<Tag[]>([]);

    constructor(private tagService: TagService) { }

    getTags():BehaviorSubject<Tag[]>{
        if(!this.cache.isInitialized){
            this.reloadCache();
        }

        return this.cache;
    }

    reloadCache() {
        this.cache.isInitialized = true;
        this.tagService.read()
            .subscribe(tags => this.cache.next(tags),
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
