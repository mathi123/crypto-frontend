import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AccountService } from '../server-api/account.service';
import { Account } from '../models/account';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public accountsAvailable: boolean = false;
  private accountsSubscription: Subscription;

  constructor(private accountService: AccountService) { }

  ngOnInit() {
    this.accountsSubscription = this.accountService
      .read()
      .subscribe(acc => this.accountsChanged(acc));
  }

  ngOnDestroy(){
    this.accountsSubscription.unsubscribe();
  }

  accountsChanged(accounts: Account[]){
    this.accountsAvailable = accounts.length > 0;
  }
}
