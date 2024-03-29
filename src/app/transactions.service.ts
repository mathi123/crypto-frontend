import { Injectable } from '@angular/core';
import { Transaction } from "./transaction";
import { Account } from "./account";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { HttpClient } from "@angular/common/http";
import { Backend } from "./backend";
import { TransactionInterface } from "./backend/transaction-interface";

@Injectable()
export class TransactionsService {

  dataChange: BehaviorSubject<Transaction[]> = new BehaviorSubject<Transaction[]>([]);
  get data(): Transaction[] { return this.dataChange.value; }

  constructor(private httpClient: HttpClient) { }

  getTransaction(account: Account, id: string){
    console.log("get transactions for " + account.name + " and id " + id);

    return this.data.filter(t => t.account === account && t.id === id)[0];
  }

  getTransactions(account: Account){
    return this.data.filter(t => t.account === account);
  }

  loadTransactions(account: Account){
    account.loading = true;
    const baseUrl  = Backend.getUrl();
    const url = `${baseUrl}/coin/${account.currency.code.toLowerCase()}/${account.address}`;

    this.httpClient.get<TransactionInterface[]>(url)
      .subscribe(result => {
        const copiedData = this.data.slice();
        result.forEach(r => {
          let transaction = new Transaction();

          transaction.account = account;
          transaction.currency = account.currency.code;
          transaction.id = r.id;
          transaction.date = new Date(r.time);
          transaction.amount = r.value;

          copiedData.push(transaction);
        });

        this.dataChange.next(copiedData);
        account.loading = false;
      });
  }

  removeTransactions(account: Account){
    const copiedData = this.data.slice().filter(f => f.account !== account);
    this.dataChange.next(copiedData);
  }
}
