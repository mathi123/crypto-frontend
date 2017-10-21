import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart } from "chart.js";
import { ReportConfiguration } from '../models/report-configuration';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-dashboard-content',
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.css']
})
export class DashboardContentComponent implements OnInit, OnDestroy {
  public hasConfiguration: boolean = false;
  public isLoading: boolean = false;

  public lineChartData:Array<any> = [];
  public lineChartLabels:Array<any> = [];
  public lineChartColors:Array<any> = [];
  public lineChartOptions:any = {
    responsive: true,
    scales: {
        xAxes: [{
          type: 'time',
          time: {
              displayFormats: {
                day: 'MMM D'
            }
          }
      }]
    }
  };

  public lineChartType:string = 'line';

  private dataSubscription: Subscription;
  private configSubscription: Subscription;

  constructor(/*private dashboardDataService: DashboardDataService*/) { }

  ngOnInit() {
    //this.dataSubscription = this.dashboardDataService.dataChange.subscribe((d) => this.refreshData(d));
    //this.configSubscription = this.dashboardDataService.configurationChange.subscribe((c) => this.configChanged(c));
    this.isLoading = false;
  }

  ngOnDestroy(){
    //this.dataSubscription.unsubscribe();
    //this.configSubscription.unsubscribe();
    this.isLoading = false;
  }

  configChanged(config: ReportConfiguration){
    if(config.endDate === null ||config.endDate === undefined || config.startDate === null || config.startDate === undefined)
    {
      this.hasConfiguration = false;
    }
    else{
      this.hasConfiguration = true;
      this.isLoading = true;
    }
  }

  refreshData(data: any){
    /*let datasets = data.lines;
    let config = this.dashboardDataService.configurationChange.value;

    var labels = [];

    for(var i = 0;i<data.dates.length;i++)
    {
        let d = new Date(data.dates[i]);
        labels.push(d);
    }

    this.lineChartLabels = labels;
    this.lineChartData = datasets;
    this.lineChartColors = data.colors;

    console.log("i should stop loading now");
    this.isLoading = false;*/
  }
}
