import { Component, OnInit } from '@angular/core';
import { BuildDashboardService } from "../build-dashboard.service";
import { AccountCacheService } from '../cache/account-cache.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  accountsAvailable: boolean = false;

  constructor(private accountCacheService: AccountCacheService, private buildDashboardService: BuildDashboardService) { }

  ngOnInit() {
    this.accountsAvailable = this.accountCacheService.Accounts.value.length > 0;

    this.accountCacheService.Accounts.subscribe(acc => {
      this.accountsAvailable = acc.length > 0;
    });
    
    if(this.accountsAvailable){
      this.buildDashboardService.dashboardViewed();
    }
  }

}
