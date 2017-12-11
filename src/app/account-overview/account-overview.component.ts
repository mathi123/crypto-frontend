import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AccountService } from '../server-api/account.service';
import { Account } from '../models/account';
import { Logger } from '../logger';
import { FileCacheService } from '../server-api/file-cache.service';
import { ConfigurationService } from '../server-api/configuration.service';
import {Observable} from 'rxjs/Rx';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';

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
  public isReloading = false;

  private accountsSubscription: Subscription;

  constructor(private accountService: AccountService, private routeService: Router, private dialogService: MatDialog,
    private logger: Logger, private fileCacheService: FileCacheService, private configService: ConfigurationService) { }

  ngOnInit() {
    this.accountsSubscription = Observable.timer(0, 5000)
      .subscribe(() => this.reload());
    this.configService.UserContext.subscribe(
      ctx => { if (ctx !== null) { this.currencySymbol = ctx.currencySymbol; } }
    );
  }

  ngOnDestroy() {
    this.accountsSubscription.unsubscribe();
  }

  accountsChanged(accounts: Account[]) {
    this.isReloading = false;
    const selected = this.accounts.filter(acc => acc.moreInfo)[0];
    if (selected !== null && selected !== undefined) {
      const newAccountToSelect = accounts.filter(acc => acc.id === selected.id)[0];

      if (newAccountToSelect !== null && newAccountToSelect !== undefined) {
        newAccountToSelect.moreInfo = selected.moreInfo;
      }
    }

    this.accounts = accounts;
    this.total = accounts.reduce((curr, acc) => curr + (acc.balance * acc.priceNow), 0);

    for (const account of accounts){
      this.loadImage(account);
    }
  }

  private reload() {
    this.isReloading = true;
    this.accountService
      .read()
      .subscribe(acc => this.accountsChanged(acc));
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
    const options = {
      data: {
        title: 'Confirm',
        message: 'Are you sure you want to delete this account?'
      }
    };
    const dialogRef = this.dialogService.open(ConfirmDialogComponent, options);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.reload();
      }
    });
  }

  public edit(account) {
    this.routeService.navigate(['account', account.id]);
  }

  public open(account: Account) {
    this.logger.verbose('opening transactions');
    this.routeService.navigate(['account', account.id, 'transactions']);
  }

  public toggleMoreInfo(account: Account) {
    for (const acc of this.accounts) {
      if (acc !== account) {
        acc.moreInfo = false;
      }
    }
    account.moreInfo = !account.moreInfo;
  }
}
