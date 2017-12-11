import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AccountService } from '../server-api/account.service';
import { Account } from '../models/account';
import { Logger } from '../logger';
import { FileCacheService } from '../server-api/file-cache.service';
import { ConfigurationService } from '../server-api/configuration.service';

@Component({
  selector: 'app-account-overview',
  templateUrl: './account-overview.component.html',
  styleUrls: ['./account-overview.component.css']
})
export class AccountOverviewComponent implements OnInit, OnDestroy {
  public accounts: Account[] = [];
  public selectedIndex: number;
  public total = 0;
  public currencySymbol = '';

  private accountsSubscription: Subscription;

  constructor(private accountService: AccountService, private routeService: Router,
    private logger: Logger, private fileCacheService: FileCacheService, private configService: ConfigurationService) { }

  ngOnInit() {
    this.accountsSubscription = this.accountService
      .read()
      .subscribe(acc => this.accountsChanged(acc));
    this.configService.UserContext.subscribe(
      ctx => { if (ctx !== null) { this.currencySymbol = ctx.currencySymbol; } }
    );
  }

  ngOnDestroy() {
    this.accountsSubscription.unsubscribe();
  }

  accountsChanged(accounts: Account[]) {
    this.accounts = accounts;
    this.total = accounts.reduce((curr, acc) => curr + (acc.balance * acc.priceNow), 0);

    for (const account of accounts){
      this.loadImage(account);
    }
  }

  private loadImage(account: Account) {
    if (account.coinFileId) {
      this.fileCacheService.read(account.coinFileId)
        .subscribe(data => account.image = data);
    }
  }

  private handleError(err: Error) {
    this.logger.error('Could not load account summary', err);
  }

  public addAccount() {
    this.routeService.navigate(['account', '0']);
  }

  public delete(account) {
    this.logger.info('delete called');
    const index = this.accounts.indexOf(account);
    if (index >= 0) {
      this.accounts.splice(index, 1);
    }
  }

  public open(account: Account) {
    this.logger.info('opening account');
  }

  public toggleMoreInfo(account: Account) {
    for (const acc of this.accounts) {
      if(acc !== account){
        acc.moreInfo = false;
      }
    }
    account.moreInfo = !account.moreInfo;
  }
}
