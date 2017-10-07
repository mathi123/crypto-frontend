import { Component, OnInit } from '@angular/core';
import { Currency } from "../models/currency";
import { CryptoCurrenciesService } from "../crypto-currencies.service";
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { AccountService } from "../account.service";
import { Color } from '../color';
import { User } from '../models/user';
import { CurrencyService } from '../server-api/currency.service';
import { UserService } from '../server-api/user.service';

@Component({
  selector: 'app-register-view',
  templateUrl: './register-view.component.html',
  styleUrls: ['./register-view.component.css']
})
export class RegisterViewComponent implements OnInit {
  public user: User = new User();
  public currencies: Currency[] = [];

  constructor(private router: Router, private location: Location, private currencyService: CurrencyService,
    private userService: UserService) { }

  ngOnInit() {
    this.currencyService.read()
      .subscribe(currencies => this.currencies = currencies);
  }

  public cancel(){
    console.debug('cancel user creation');
    this.user = new User();
    this.location.back();
  }
  
  public save(){
    console.log("saving user.")
    console.log(JSON.stringify(this.user));

    this.userService.create(this.user)
      .subscribe(() => console.log("success"), 
      () => this.showFailedFeedback());  

    //this.location.back();
  }

  private showFailedFeedback(): any {
    console.error("Could not create user.");
  }
}
