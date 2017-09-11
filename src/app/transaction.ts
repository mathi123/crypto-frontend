

import { TagTypes } from "./tag-types";

export class Transaction {
    public amount: number = 0;
    public date: Date;
    public id: string;
    public tagType: string = TagTypes.None;
    public tagAmount: 0;
    public currency: string;
    public account: Account;
    
}