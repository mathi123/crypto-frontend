import { Component, OnInit, OnDestroy } from '@angular/core';
import { Currency } from "../models/currency";
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { Color } from '../models/color';
import { User } from '../models/user';
import { CurrencyService } from '../server-api/currency.service';
import { UserService } from '../server-api/user.service';
import { CurrencyCacheService } from '../cache/currency-cache.service';
import { Subscription } from 'rxjs/Subscription';
import { Logger } from '../logger';

@Component({
  selector: 'app-register-view',
  templateUrl: './register-view.component.html',
  styleUrls: ['./register-view.component.css']
})
export class RegisterViewComponent implements OnInit, OnDestroy {
  public user: User = new User();
  public currencies: Currency[] = [];

  private currencySubscription: Subscription;
  private isValidating: boolean = false;
  private isLoggingIn: boolean = false;
  private showErrorMessage: boolean = false;

  constructor(private router: Router, private location: Location, private currencyCacheService: CurrencyCacheService,
    private userService: UserService, private logger: Logger) { }

  ngOnInit() {
    this.currencySubscription = this.currencyCacheService.getCurrencies()
      .subscribe(currencies => this.currencies = currencies,
                 err => this.fatalError(err));
  }

  ngOnDestroy(){
    this.currencySubscription.unsubscribe();
  }

  public cancel(){
    this.logger.verbose("cancel register new user.");
    this.resetData();
    this.location.back();
  }
  
  public save(){
    this.logger.verbose("saving user.", this.user)
    this.showErrorMessage = false;
    this.isValidating = true;
    

    this.userService.create(this.user)
      .subscribe(() => this.userSaveSuccess(), 
                (err) => this.userSaveFailed(err));
  }

  private isValid():Boolean{
    return this.user.password === this.user.repeatPassword;
  }

  private userSaveSuccess(){
    this.logger.verbose("success");
  }

  private userSaveFailed(err:Error){
    this.logger.error("login failed", err);
    this.showErrorMessage = true;
    this.isLoggingIn = false;
  }

  private resetData(){
    this.user = new User();
    this.isLoggingIn = false;
    this.isValidating = false;
    this.showErrorMessage = false;
  }

  private fatalError(err){
    this.logger.error(err);
  }

  private showFailedFeedback(): any {
    console.error("Could not create user.");
  }
}
