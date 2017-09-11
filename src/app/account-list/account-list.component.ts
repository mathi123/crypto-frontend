import { Component, OnInit } from '@angular/core';
import { AccountService } from "../account.service";

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit {
  accounts: Account[] = [];

  constructor(private accountService: AccountService) { }

  ngOnInit() {
    this.accountsChanged(this.accountService.data);
    this.accountService.dataChange.subscribe(this.accountsChanged);
  }

  accountsChanged(accounts: Account[]){
    this.accounts = accounts;
  }

}
