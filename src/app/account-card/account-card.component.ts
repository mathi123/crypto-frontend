import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Account } from '../models/account';
import { Logger } from '../logger';
import { Router } from '@angular/router';
import { AccountService } from '../server-api/account.service';
import { MatDialog, MatMenuPanel, MatMenuTrigger } from '@angular/material';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AccountPriceDetailComponent } from '../account-price-detail/account-price-detail.component';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Subscription } from 'rxjs/Subscription';
import { ConfigurationService } from '../server-api/configuration.service';

@Component({
  selector: 'app-account-card',
  templateUrl: './account-card.component.html',
  styleUrls: ['./account-card.component.css']
})
export class AccountCardComponent implements OnInit, OnDestroy {
  @Input()
  public account: Account = new Account();

  @Output()
  public deleted: EventEmitter<any> = new EventEmitter();

  @Output()
  public menuOpened: EventEmitter<any> = new EventEmitter();

  @Output()
  public menuClosed: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatMenuTrigger)
  public menuTrigger: MatMenuTrigger = null;

  public currencySymbol = '';

  private menuOpenSubscription: Subscription;
  private menuClosedSubscription: Subscription;

  constructor(private accountService: AccountService,
    private routeService: Router, private dialogService: MatDialog,
    private logger: Logger, private configService: ConfigurationService) { }

  ngOnInit() {
    if (this.menuTrigger !== null) {
      this.menuOpenSubscription = this.menuTrigger.onMenuOpen.subscribe(menu => this.menuOpen(menu));
      this.menuClosedSubscription = this.menuTrigger.onMenuClose.subscribe(menu => this.menuClose(menu));
    }
    this.configService.UserContext.subscribe(
      ctx => { if (ctx !== null) { this.currencySymbol = ctx.currencySymbol; } }
    );
  }

  ngOnDestroy() {
    if (this.menuTrigger !== null) {
      this.menuOpenSubscription.unsubscribe();
      this.menuClosedSubscription.unsubscribe();
    }
  }

  public edit(account: Account) {
    this.routeService.navigate(['account', account.id]);
  }

  public open(account: Account) {
    this.logger.verbose('opening transactions');
    this.routeService.navigate(['account', account.id, 'transactions']);
  }

  public toggleMoreInfo(account: Account) {
    const options = {
      data: {
        account
      }
    };
    const dialogRef = this.dialogService.open(AccountPriceDetailComponent, options);

    dialogRef.afterClosed()
      .subscribe(s => this.logger.verbose('dialog closed'));
  }
  public delete(account: Account) {
    this.deleted.next();
  }

  private menuOpen(data: any) {
    this.menuOpened.next();
  }

  private menuClose(data: any) {
    this.menuClosed.next();
  }
}
