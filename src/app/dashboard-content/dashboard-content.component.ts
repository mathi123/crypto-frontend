import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DashboardDataService } from "../dashboard-data.service";
import { Chart } from "chart.js";
import { ReportConfiguration } from '../report-configuration';

@Component({
  selector: 'app-dashboard-content',
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.css']
})
export class DashboardContentComponent implements OnInit {
  //@ViewChild('myChart')
  //chart: ElementRef;
  public hasConfiguration: boolean = false;
  public isLoading: boolean = false;

  static chart: any;
  
  constructor(private dashboardDataService: DashboardDataService) { }

  ngOnInit() {
    this.dashboardDataService.dataChange.subscribe(this.getRefreshData());
    this.dashboardDataService.configurationChange.subscribe(this.configChanged);
  }

  configChanged(config: ReportConfiguration){
    if(config.endDate === null ||config.endDate === undefined || config.startDate === null || config.startDate === undefined)
    {
      this.hasConfiguration = false;
    }
    else{
      console.log("should start loading");
      this.hasConfiguration = true;
      this.isLoading = true;
    }
  }

  getRefreshData(){
    return (d) => this.refreshData(d);
  }

  refreshData(data: any){
    console.log("should end loading");
    let datasets = data.lines;
    console.log('new data');
    console.log(data);

    let config = this.dashboardDataService.configurationChange.value;
    
    var labels = [];
    var results = [];

    for(var i = 0;i<data.dates.length;i++)
    {
        let d = new Date(data.dates[i]);
        labels.push(d);
    }

    if(DashboardContentComponent.chart !== null && DashboardContentComponent.chart !== undefined){
      DashboardContentComponent.chart.destroy();
    }

    var ctx = (<HTMLCanvasElement> document.getElementById("myChart")).getContext('2d');

    DashboardContentComponent.chart = new Chart(ctx, {
        type: 'line',
        labels: labels,
        data: {
            datasets: datasets
        },
        options: {
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
      }
    });

    this.isLoading = false;
  }
}
