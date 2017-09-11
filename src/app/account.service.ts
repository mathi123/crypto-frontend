import { Injectable } from '@angular/core';
import { TransactionsService } from "./transactions.service";
import { Account } from "./account";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class AccountService {
  dataChange: BehaviorSubject<Account[]> = new BehaviorSubject<Account[]>([]);
  get data(): Account[] { return this.dataChange.value; }

  constructor(private transactionsService: TransactionsService) { }

  getAccounts(){
    return this.data;
  }

  getAccount(name:string){
    return this.data.filter(a => a.name === name)[0];
  }

  addAccount(account: Account){
    console.info('account added');

    this.add(account);
    this.transactionsService.loadTransactions(account);
  }

  removeAccount(account: Account){
    console.info('account removed');

    const copiedData = this.data.slice();
    copiedData.splice(copiedData.indexOf(account), 1);
    this.transactionsService.removeTransactions(account);

    this.dataChange.next(copiedData);
  }

  private add(account: Account) {
    const copiedData = this.data.slice();
    copiedData.push(account);
    this.dataChange.next(copiedData);
  }
}
