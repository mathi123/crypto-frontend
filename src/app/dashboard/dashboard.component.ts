import { Component, OnInit } from '@angular/core';
import { AccountService } from "../account.service";
import { BuildDashboardService } from "../build-dashboard.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  accountsAvailable: boolean = false;

  constructor(private accountService: AccountService, private buildDashboardService: BuildDashboardService) { }

  ngOnInit() {
    this.accountsAvailable = this.accountService.data.length > 0;
    this.accountService.dataChange.subscribe(acc => {
      this.accountsAvailable = acc.length > 0;
    });
    if(this.accountService.data.length > 0){
      this.buildDashboardService.dashboardViewed();
    }
  }

}
