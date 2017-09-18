import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardDataService } from '../dashboard-data.service';
import { ReportSummary } from '../report-summary';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-dashboard-summary',
  templateUrl: './dashboard-summary.component.html',
  styleUrls: ['./dashboard-summary.component.css']
})
export class DashboardSummaryComponent implements OnInit, OnDestroy {
  public summary: ReportSummary = new ReportSummary();

  private summarySubscription: Subscription;
  
  constructor(private dashboardDataService: DashboardDataService) { }

  ngOnInit() {
    this.summarySubscription = this.dashboardDataService.reportSummary.subscribe((sum) => this.summary = sum);
  }

  ngOnDestroy(){
    this.summarySubscription.unsubscribe();
  }

}
