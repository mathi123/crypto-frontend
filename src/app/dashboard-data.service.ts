import { Injectable } from '@angular/core';
import { TransactionsService } from "./transactions.service";
import { Account } from "./account";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { ReportConfiguration } from "./report-configuration";
import { Backend } from "./backend";
import { HttpClient } from "@angular/common/http";
import { AccountService } from "./account.service";

@Injectable()
export class DashboardDataService {
  configurationChange: BehaviorSubject<ReportConfiguration> = new BehaviorSubject<ReportConfiguration>(new ReportConfiguration());

  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  get data(): any[] { return this.dataChange.value; }

  constructor(private transactionsService: TransactionsService, private httpClient: HttpClient, private accountService: AccountService) { }

  recalculate(configuration: ReportConfiguration){
    this.configurationChange.next(configuration);
    this.dataChange.next([]);
    this.accountService.data.forEach((a) => this.recalculateAccount(a, configuration));
  }

  private add(line: any) {
    const copiedData = this.data.slice();
    copiedData.push(line);
    this.dataChange.next(copiedData);
  }

  recalculateAccount(account: Account, configuration: ReportConfiguration){
    console.log('recalculate');
    const fromDate = configuration.startDate.getTime();
    const toDate = configuration.endDate.getTime();

    const url = `${Backend.Url}/coins/${account.currency.code.toLowerCase()}/price?fromDate=${fromDate}&toDate=${toDate}`;
    
    this.httpClient.get<Price[]>(url)
      .subscribe(result => {
        this.recalculateLine(account, result);
      });
  }

  recalculateLine(account: Account, prices: Price[]){
    console.table(prices);

    let transactions = this.transactionsService.getTransactions(account);
    console.table(transactions);

    let result = {
      label: account.name,
      data: [],
      borderColor: account.color.hexValue,
     // backgroundColor: account.color.hexValue,
    };

    prices = prices.sort((a, b) => a.ts - b.ts);

    for(var i = 0; i < prices.length;i++){
      var date = new Date(prices[i].ts);
      var price = prices[i].price;

      var amount = transactions.filter(t => t.date <= date).map(t => t.amount).reduce((prev, curr) => prev + curr, 0);

      var total = price * amount;
      result.data.push({
        x: date,
        y: total
      });
    }

    this.add(result);
  }

}

interface Price{
  ts: number,
  price: number
}
