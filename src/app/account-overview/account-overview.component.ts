import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AccountService } from '../server-api/account.service';
import { Account } from '../models/account';
import { Logger } from '../logger';
import { FileCacheService } from '../server-api/file-cache.service';

@Component({
  selector: 'app-account-overview',
  templateUrl: './account-overview.component.html',
  styleUrls: ['./account-overview.component.css']
})
export class AccountOverviewComponent implements OnInit, OnDestroy {
  public accounts: Account[] = [];
  public selectedIndex: number;

  private accountsSubscription: Subscription;

  constructor(private accountService: AccountService, private routeService: Router,
    private logger: Logger, private fileCacheService: FileCacheService) { }

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

    for (const account of accounts){
      this.loadImage(account);
    }
  }

  private loadImage(account: Account) {
    if (account.fileId) {
      this.fileCacheService.read(account.fileId)
        .subscribe(data => account.image = data);
    }
  }

  private handleError(err: Error) {
    this.logger.error('Could not load account summary', err);
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
}
