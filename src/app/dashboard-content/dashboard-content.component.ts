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
  hasConfiguration: boolean = false;

  constructor(private dashboardDataService: DashboardDataService) { }

  ngOnInit() {
    this.dashboardDataService.dataChange.subscribe(this.getRefreshData());
    this.dashboardDataService.configurationChange.subscribe(this.configChanged);
  }

  configChanged(configuration: ReportConfiguration){

  }

  getRefreshData(){
    return (d) => this.refreshData(d);
  }

  refreshData(datasets: any[]){

    console.log('new data');
    console.log(datasets);

    let config = this.dashboardDataService.configurationChange.value;
    if(config.endDate === null ||config.endDate === undefined || config.startDate === null || config.startDate === undefined)
    {
      this.hasConfiguration = false;
      return;
    }
    else{
      this.hasConfiguration = true;
    }

    let maxReq = 50;
    let totalDiffMs = config.startDate.getTime() - config.endDate.getTime();
    let daysInDiff = totalDiffMs / (24 * 60 * 60 * 1000);
    let requests = Math.min(maxReq, daysInDiff);
    let step = Math.ceil(totalDiffMs / requests);

    var labels = [];
    var results = [];

    for(var i = 0;i<requests;i++)
    {
        let d = new Date(config.startDate.getTime() + i * step);
        labels.push(d);
    }

    console.log(labels);

    var ctx = (<HTMLCanvasElement> document.getElementById("myChart")).getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        labels: labels,
        data: {
            datasets: datasets
        },
        options: {
          scaleLabel: "<%=value%> EUR",
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

    //c.data.datasets = datasets;
  }
}
