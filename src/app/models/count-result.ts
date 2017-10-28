export class CountResult<T>{
    public records: T[];
    public count: number;

    constructor(recs: T[], count: number){
        this.records = recs;
        this.count = count;
    }
}