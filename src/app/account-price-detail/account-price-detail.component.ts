import { Component, OnInit, Input, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import { Account } from '../models/account';
import { Logger } from '../logger';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AccountService } from '../server-api/account.service';
import { ConfigurationService } from '../server-api/configuration.service';

@Component({
  selector: 'app-account-price-detail',
  templateUrl: './account-price-detail.component.html',
  styleUrls: ['./account-price-detail.component.css']
})
export class AccountPriceDetailComponent implements OnInit {
  @Input()
  public account: Account;

  public currencySymbol = '';

  constructor(public dialogRef: MatDialogRef<AccountPriceDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any, private logger: Logger,
    private accountService: AccountService,
    private routeService: Router, private dialogService: MatDialog, private configService: ConfigurationService) { }

  ngOnInit() {
    if (this.data !== null && this.data !== undefined) {
      this.account = this.data.account;
    }
    this.configService.UserContext.subscribe(
      ctx => { if (ctx !== null) { this.currencySymbol = ctx.currencySymbol; } }
    );
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
        this.accountService.delete(account.id)
          .subscribe(r => this.dialogRef.close());
      }
    });
  }

  public edit(account) {
    this.dialogRef.close();
    this.routeService.navigate(['account', account.id]);
  }

  public open(account: Account) {
    this.dialogRef.close();
    this.logger.verbose('opening transactions');
    this.routeService.navigate(['account', account.id, 'transactions']);
  }
}
