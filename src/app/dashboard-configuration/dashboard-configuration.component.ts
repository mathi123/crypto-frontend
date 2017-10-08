import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ReportConfiguration } from '../models/report-configuration';

@Component({
  selector: 'app-dashboard-configuration',
  templateUrl: './dashboard-configuration.component.html',
  styleUrls: ['./dashboard-configuration.component.css']
})
export class DashboardConfigurationComponent implements OnInit {
  configuration: ReportConfiguration;
  maxDate = new Date(Date.now());

  public hasError: boolean = false;

  constructor(/*private dashboardDataService: DashboardDataService*/) { }

  ngOnInit() {
    //this.configuration = this.dashboardDataService.configurationChange.value;
  }

  recalculate(){
    this.hasError = false;
    //this.dashboardDataService.recalculate(this.configuration, (error) => this.hasError = true);
  }

  closeError(){
    this.hasError = false;
  }
}
