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

  dataChange: BehaviorSubject<any> = new BehaviorSubject<any>({ lines: [], dates: []});
  get data(): any { return this.dataChange.value; }

  constructor(private transactionsService: TransactionsService, private httpClient: HttpClient, private accountService: AccountService) { }
   
  recalculate(configuration: ReportConfiguration){
    this.configurationChange.next(configuration);
    
    console.log('recalculating');
    const fromDate = configuration.startDate.getTime();
    const toDate = configuration.endDate.getTime();
    const currencies = this.accountService.data
                        .map(a => a.currency.code)
                        .filter((el, i, a) => i === a.indexOf(el))
                        .reduce((x,y) => x + ',' + y);

    const baseUrl  = Backend.getUrl();
    
    let dates = this.transactionsService.data.filter(t => t.date >= configuration.startDate && t.date <= configuration.endDate)
      .map(t => t.date.getTime().toString())
      .filter((el, i, a) => i === a.indexOf(el))
      .reduce((x,y) => x + ',' + y);

    const url = `${baseUrl}/price?currency=${currencies}&fromDate=${fromDate}&toDate=${toDate}&include=${dates}`;
    
    this.httpClient.get<GetPricesResult>(url)
      .subscribe(data => {
        console.log(data);    
        const copiedData = [];
        for(let account of this.accountService.data){
          let line = this.recalculateLine(account, data);
    
          copiedData.push(line);
        }
        this.data.lines = copiedData;
        this.data.dates = data.dates;

        this.dataChange.next(this.data);
      });    
  }

  recalculateLine(account: Account, data: GetPricesResult):any{
    console.table(data);

    let transactions = this.transactionsService.getTransactions(account);
    console.table(transactions);

    let result = {
      label: account.name,
      data: [],
      borderColor: account.color.hexValue,
    };

    
    let prices = data.prices.filter(p => p.currency === account.currency.code)[0].prices.sort((a, b) => a.ts - b.ts);

    for(var i = 0; i < prices.length;i++){
      var date = new Date(prices[i].ts);

      var price = prices[i].price;

      var before = transactions.filter(t => t.date <= date);
      //console.log("transactions before " + date);
      //console.table(before);
      var amount = before.map(t => t.amount).reduce((prev, curr) => prev + curr, 0);

      var total = price * amount;

      result.data.push({
        x: date,
        y: total
      });
    }

    return result;
  }
}

interface GetPricesResult{
  prices: PriceResult[];
  dates: string[];
}

interface PriceResult{
  currency: string;
  prices: Price[]
}

interface Price{
  ts: number,
  price: number
}
