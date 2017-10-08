import { Component, OnInit } from '@angular/core';
import { Account } from '../account';
import { Currency } from "../currency";
import { CryptoCurrenciesService } from "../crypto-currencies.service";
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { AccountService } from "../account.service";
import { Color } from '../color';

@Component({
  selector: 'app-account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.css']
})
export class AccountViewComponent implements OnInit {
  public account: Account;
  public currencies: Currency[] = [];
  public colors: Color[] = [];

  constructor(private cryptoCurrencies: CryptoCurrenciesService, private router: Router,
    private location: Location, private accountService: AccountService) { }

  ngOnInit() {
    this.account = new Account();
    this.colors = Color.getDefaults();
    this.account.color = this.colors[this.accountService.data.length % this.colors.length];
    this.account.showInReporting = true;
    this.cryptoCurrencies.getCurrencies()
      .subscribe(list => this.currencies = list);
  }

  public cancel(){
    console.debug('cancel');

    this.location.back();
  }
  
  public save(){
    console.debug('save');

    this.accountService.addAccount(this.account);

    this.location.back();
  }
}
