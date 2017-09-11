import { Component, OnInit } from '@angular/core';
import { BuildDashboardService } from "../build-dashboard.service";
import { Router } from "@angular/router";
import { AccountService } from "../account.service";
import { TransactionsService } from "../transactions.service";

@Component({
  selector: 'app-account-overview',
  templateUrl: './account-overview.component.html',
  styleUrls: ['./account-overview.component.css']
})
export class AccountOverviewComponent implements OnInit {
  public accounts: Account[] = [];
  
  constructor(public accountService: AccountService, public routeService: Router, public buildDashboardService: BuildDashboardService) { }

  ngOnInit() {
    this.accounts = this.accountService.getAccounts();
    this.accountService.dataChange.subscribe(accounts => {
      this.accounts = accounts;
    });
  }

  addAccount(){
    console.log('add account');

    this.routeService.navigate(['account', 0]);
  }
}
