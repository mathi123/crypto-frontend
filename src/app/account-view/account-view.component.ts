import { Component, OnInit } from '@angular/core';
import { Account } from '../models/account';
import { Coin } from "../models/coin";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { AccountService } from "../server-api/account.service";
import { Color } from '../models/color';
import { AccountCacheService } from '../cache/account-cache.service';
import { CoinCacheService } from '../cache/coin-cache.service';
import { TransactionType } from '../models/transaction-type';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.css']
})
export class AccountViewComponent implements OnInit {
  public account: Account = new Account();
  public coins: Coin[] = [];
  public colors: Color[] = [];
  public transactionTypes = [
    new TransactionType("auto", "Load automatically")
  ];

  private routeParamsSubscription: Subscription;

  constructor(private router: Router, private location: Location, private route: ActivatedRoute,
    private accountCache: AccountCacheService, private coinCacheService: CoinCacheService) { }

  ngOnInit() {
    this.colors = Color.getDefaults();

    this.routeParamsSubscription = this.route.params.subscribe(params => {
      let id = params['id'];

      if(id === undefined || id === null || id === '0'){
        this.account = new Account();
        this.account.color = this.colors[0].hexValue;
      }else{
        this.accountCache.getById(id)
          .subscribe(acc => this.account = acc);
      }
    });

    this.coinCacheService.getCoins()
      .subscribe(list => this.coins = list);
  }

  public cancel(){
    console.debug('cancel');

    this.location.back();
  }
  
  public save(){
    console.debug('save');

    if(this.account.id === null || this.account.id === undefined){
      this.accountCache.addAccount(this.account)
        .subscribe((account) => {
          this.location.back();
          }, (err) => this.errorFeedback(err));
    }else{
      this.accountCache.update(this.account)
        .subscribe(() => {
        this.location.back();
        }, (err) => this.errorFeedback(err));
    }
  }

  errorFeedback(err){
    console.error(err);
  }
}
