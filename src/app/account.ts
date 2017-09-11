import { Currency } from "./currency";
import { Transaction } from "./transaction";
import { Color } from "./color";

export class Account {
    public loading: boolean = true;
    public name: string;
    public address: string;
    public currency: Currency;
    public showInReporting: boolean;
    public color: Color;

    constructor(){
        this.name = '';
        this.address = '';
    }
}