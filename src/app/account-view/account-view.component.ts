import { Component, OnInit } from '@angular/core';
import { Account } from '../models/account';
import { Coin } from "../models/coin";
import { CoinService } from "../server-api/coin.service";
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { AccountService } from "../server-api/account.service";
import { Color } from '../models/color';
import { AccountCacheService } from '../cache/account-cache.service';
import { CoinCacheService } from '../cache/coin-cache.service';

@Component({
  selector: 'app-account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.css']
})
export class AccountViewComponent implements OnInit {
  public account: Account;
  public coins: Coin[] = [];
  public colors: Color[] = [];

  constructor(private router: Router, private location: Location, 
    private accountCache: AccountCacheService, private coinCacheService: CoinCacheService) { }

  ngOnInit() {
    this.account = new Account();
    this.colors = Color.getDefaults();
    this.account.color = this.colors[0].hexValue;
    
    this.coinCacheService.getCoins()
      .subscribe(list => this.coins = list);
  }

  public cancel(){
    console.debug('cancel');

    this.location.back();
  }
  
  public save(){
    console.debug('save');

    this.accountCache.addAccount(this.account)
    .subscribe((account) => {
      this.location.back();
      }, (err) => this.errorFeedback(err));
  }

  errorFeedback(err){
    console.error(err);
  }
}
