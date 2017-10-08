import { Component, OnInit, OnDestroy } from '@angular/core';
import { Account } from "../models/account";
import { AccountCacheService } from '../cache/account-cache.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit, OnDestroy {
  private accounts: Account[] = [];
  private accountsSubscription: Subscription;

  constructor(private accountCacheService: AccountCacheService) { }

  ngOnInit() {
    this.accountsSubscription = this.accountCacheService
      .getAccounts()
      .subscribe(acc => this.accountsChanged(acc));
  }

  ngOnDestroy(){
    this.accountsSubscription.unsubscribe();
  }

  accountsChanged(accounts: Account[]){
    this.accounts = accounts;
  }

}
