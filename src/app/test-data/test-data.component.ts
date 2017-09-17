import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';
import { CryptoCurrenciesService } from '../crypto-currencies.service';
import { Currency } from '../currency';
import { Account } from '../account';
import { Color } from '../color';

@Component({
  selector: 'app-test-data',
  templateUrl: './test-data.component.html',
  styleUrls: ['./test-data.component.css']
})
export class TestDataComponent implements OnInit {

  constructor(private cryptoCurrencies: CryptoCurrenciesService, private accountService: AccountService, private router: Router) { }

  ngOnInit() {
    this.initSomeData();
  }

  initSomeData(){
    this.cryptoCurrencies.getCurrencies()
    .subscribe(curr => {
      this.initWithCurrencies(curr);
    });
  }

  initWithCurrencies(currencies: Currency[]){
    let ether = currencies.filter(c => c.code === "ETH")[0];

    this.addAccount(ether, "Exodus Ether", "0x774674721019061a89fCD312e8040C0Fe67613ce");
    this.addAccount(ether, "Coinbase Ether", "0x8B2C6e59079D8F1B173b588Cd47E5e1676F31388");

    let btc = currencies.filter(c => c.code === "BTC")[0];
    this.addAccount(btc, "Exodus Bitcoin", "145XocnJFL21YgnshbDx65KZDBXqTk6GyQ");
    this.addAccount(btc, "Bittrex BTC", "1J3PRZT5DcHG92zh4tBvAKo6iierEYTMMr");
    this.addAccount(btc, "Coinbase BTC", "1PZVMGDwaredL6dP8cbgEVAb5MDj7yhxru");

    let ltc = currencies.filter(c => c.code === "LTC")[0];
    this.addAccount(ltc, "Exodus Litecoin", "LXFwxKpkpp4Y8au77CTUENemgmBzooo2Sh");

    this.router.navigateByUrl('/accounts');
  }

  addAccount(currency: Currency, name: string, address: string){
    let account = new Account();

    account.currency = currency;
    account.name = name;
    account.address = address;

    this.setColor(account);

    this.accountService.addAccount(account);
  }

  setColor(account: Account){
    let colors = Color.getDefaults();
    account.color = colors[this.accountService.data.length % colors.length];
  }
}
