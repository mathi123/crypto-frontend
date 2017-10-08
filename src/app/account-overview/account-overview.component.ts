import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { AccountCacheService } from '../cache/account-cache.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-account-overview',
  templateUrl: './account-overview.component.html',
  styleUrls: ['./account-overview.component.css']
})
export class AccountOverviewComponent implements OnInit, OnDestroy {
  private accounts: Account[] = [];
  private accountsSubscription: Subscription;
  
  constructor(private accountCacheService: AccountCacheService, private routeService: Router) { }

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

  addAccount(){
    this.routeService.navigate(['account', 0]);
  }
}
