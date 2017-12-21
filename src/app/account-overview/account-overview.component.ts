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
import { ObservableMedia, MediaChange } from '@angular/flex-layout';
import { AccountPriceDetailComponent } from '../account-price-detail/account-price-detail.component';

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
  public columns = 4;

  private accountsSubscription: Subscription;
  private menuIsOpen = false;

  constructor(private accountService: AccountService,
    private routeService: Router, private dialogService: MatDialog,
    private logger: Logger, private fileCacheService: FileCacheService, private configService: ConfigurationService,
    private media: ObservableMedia) { }

  ngOnInit() {
    this.accountsSubscription = Observable.timer(0, 5000)
      .subscribe(() => this.reload());
    this.configService.UserContext.subscribe(
      ctx => { if (ctx !== null) { this.currencySymbol = ctx.currencySymbol; } }
    );
    this.media.subscribe(media => this.mediaChanged(media));
    this.applyMediaQuery();
  }

  private mediaChanged(media: MediaChange) {
    switch (media.mqAlias) {
      case 'xs': this.columns = 1; break;
      case 'sm': this.columns = 2; break;
      case 'md': this.columns = 3; break;
      case 'lg': this.columns = 4; break;
    }
  }

  private applyMediaQuery() {
    if (this.media.isActive('xs')) {
      this.columns = 1;
    }
    if (this.media.isActive('sm')) {
      this.columns = 2;
    }
    if (this.media.isActive('md')) {
      this.columns = 3;
    }
    if (this.media.isActive('lg')) {
      this.columns = 4;
    }
  }

  ngOnDestroy() {
    this.accountsSubscription.unsubscribe();
  }

  accountsChanged(accounts: Account[]) {
    this.isReloading = false;

    if (!this.menuIsOpen) {
      this.accounts = accounts;
      this.total = accounts.reduce((curr, acc) => curr + (acc.balance * acc.priceNow), 0);

      for (const account of accounts){
        this.loadImage(account);
      }
    }
  }

  public menuOpened() {
    this.logger.verbose('some menu opened');
    this.menuIsOpen = true;
  }

  public menuClosed() {
    this.logger.verbose('some menu closed');
    this.menuIsOpen = false;
  }

  public reload() {
    this.logger.verbose('reloading...');
    this.isReloading = true;
    this.accountService
      .read()
      .subscribe(acc => this.accountsChanged(acc));
  }

  public delete(account: Account) {
    const options = {
      data: {
        title: 'Confirm',
        message: 'Are you sure you want to delete this account?'
      }
    };

    const dialogRef = this.dialogService.open(ConfirmDialogComponent, options);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.accountService.delete(account.id)
          .subscribe(r => this.reload());
      }
    });
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
}
