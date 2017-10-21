import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountCacheService } from '../cache/account-cache.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private accountsAvailable: boolean = false;
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
    this.accountsAvailable = accounts.length > 0;
  }
}
