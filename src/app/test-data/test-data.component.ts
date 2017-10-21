import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Currency } from '../models/currency';
import { Account } from '../models/account';
import { Color } from '../models/color';
import { CoinCacheService } from '../cache/coin-cache.service';
import { AccountCacheService } from '../cache/account-cache.service';
import { Coin } from '../models/coin';

@Component({
  selector: 'app-test-data',
  templateUrl: './test-data.component.html',
  styleUrls: ['./test-data.component.css']
})
export class TestDataComponent implements OnInit {

  constructor(private coinCacheService: CoinCacheService, private accountCacheService: AccountCacheService, private router: Router) { }

  ngOnInit() {
    this.initSomeData();
  }

  initSomeData(){
    this.coinCacheService.getCoins()
    .subscribe(curr => this.initWithCurrencies(curr));
  }

  initWithCurrencies(coins: Coin[]){
    let ether = coins.filter(c => c.code === "ETH")[0];

    this.addAccount(ether, "Exodus Ether", "0x774674721019061a89fCD312e8040C0Fe67613ce");
    this.addAccount(ether, "Coinbase Ether", "0x8B2C6e59079D8F1B173b588Cd47E5e1676F31388");

    let btc = coins.filter(c => c.code === "BTC")[0];
    this.addAccount(btc, "Exodus Bitcoin", "145XocnJFL21YgnshbDx65KZDBXqTk6GyQ");
    this.addAccount(btc, "Bittrex BTC", "1J3PRZT5DcHG92zh4tBvAKo6iierEYTMMr");
    this.addAccount(btc, "Coinbase BTC", "1PZVMGDwaredL6dP8cbgEVAb5MDj7yhxru");

    let ltc = coins.filter(c => c.code === "LTC")[0];
    this.addAccount(ltc, "Exodus Litecoin", "LXFwxKpkpp4Y8au77CTUENemgmBzooo2Sh");

    this.router.navigateByUrl('/accounts');
  }

  addAccount(coin: Coin, name: string, address: string){
    let account = new Account();

    account.coinId = coin.id;
    account.description = name;
    account.address = address;

    this.setColor(account);

    this.accountCacheService.addAccount(account);
  }

  setColor(account: Account){
    let colors = Color.getDefaults();
    account.color = colors[0].hexValue;
  }
}
