import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AccountService } from '../server-api/account.service';
import { Account } from '../models/account';
import { Logger } from '../logger';

@Component({
  selector: 'app-account-overview',
  templateUrl: './account-overview.component.html',
  styleUrls: ['./account-overview.component.css']
})
export class AccountOverviewComponent implements OnInit, OnDestroy {
  public accounts: Account[] = [];
  public selectedIndex: number;

  private accountsSubscription: Subscription;

  constructor(private accountService: AccountService, private routeService: Router, private logger: Logger) { }

  ngOnInit() {
    this.accountsSubscription = this.accountService
      .read()
      .subscribe(acc => this.accountsChanged(acc));
  }

  ngOnDestroy() {
    this.accountsSubscription.unsubscribe();
  }

  accountsChanged(accounts: Account[]) {
    this.accounts = accounts;
  }

  addAccount() {
    this.routeService.navigate(['account', '0']);
  }

  delete(account){
    this.logger.info('delete called');
    const index = this.accounts.indexOf(account);
    if (index >= 0){
      this.accounts.splice(index, 1);
    }
  }

  selectedIndexChange(nr){
    this.logger.info(`Selected tab index: ${nr}`);
    this.selectedIndex = nr;
  }
}
