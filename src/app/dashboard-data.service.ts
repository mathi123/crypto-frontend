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
        const colors = [];
        let totals = {};
        for(let account of this.accountService.data){
          let line = this.recalculateLine(account, data, totals);
          copiedData.push(line);
          colors.push({
            borderColor: line.borderColor
          });
        }
        let total = this.recalculateTotal(data, totals);
        copiedData.push(total);
        colors.push({
          borderColor: "#FF4081"
        });

        this.data.lines = copiedData;
        this.data.dates = data.dates;
        this.data.colors = colors;

        this.dataChange.next(this.data);
      });    
  }

  recalculateLine(account: Account, data: GetPricesResult, totals:any):any{
    let transactions = this.transactionsService.getTransactions(account);

    let result = {
      label: account.name,
      data: [],
      borderColor: account.color.hexValue,
    };
    
    let prices = data.prices.filter(p => p.currency === account.currency.code)[0].prices.sort((a, b) => a.ts - b.ts);

    for(var i = 0; i < prices.length;i++){
      let date = new Date(prices[i].ts);
      let price = prices[i].price;
      let before = transactions.filter(t => t.date <= date);
      let amount = before.map(t => t.amount).reduce((prev, curr) => prev + curr, 0);

      let total = price * amount;

      let ts = date.getTime();
      if(totals[ts] === undefined){
        totals[ts] = total;
      }else{
        totals[ts] = totals[ts] + total;
      }

      result.data.push({
        x: date,
        y: total
      });
    }

    return result;
  }

  recalculateTotal(data: GetPricesResult, totals: any):any{
    let result = {
      label: 'Total',
      data: [],
      borderColor: "#FF4081",
    };
   
    for(var i = 0; i < data.dates.length;i++){
      let date = new Date(data.dates[i]);
      
      let total = totals[date.getTime()];

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
