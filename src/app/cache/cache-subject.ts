import { BehaviorSubject } from "rxjs/BehaviorSubject";

export class CacheSubject<T> extends BehaviorSubject<T>{
    public isInitialized: boolean = false;
    
    constructor(value: T){
        super(value);
    }
}