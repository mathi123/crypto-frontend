import { Component, OnInit } from '@angular/core';
import { ReportConfiguration } from "../report-configuration";
import { HttpClient } from "@angular/common/http";
import { Backend } from "../backend";
import { Account } from "../account";
import { AccountService } from "../account.service";
import { DashboardDataService } from "../dashboard-data.service";

@Component({
  selector: 'app-dashboard-configuration',
  templateUrl: './dashboard-configuration.component.html',
  styleUrls: ['./dashboard-configuration.component.css']
})
export class DashboardConfigurationComponent implements OnInit {
  configuration: ReportConfiguration;
  maxDate = new Date(Date.now());

  constructor(private dashboardDataService: DashboardDataService) { }

  ngOnInit() {
    this.configuration = this.dashboardDataService.configurationChange.value;
  }

  recalculate(){
    this.dashboardDataService.recalculate(this.configuration);
  }
}
