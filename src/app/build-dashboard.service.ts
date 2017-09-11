import { Injectable } from '@angular/core';

@Injectable()
export class BuildDashboardService {
  public hasTags: boolean = false;
  public hasViewdDashboard: boolean = false;

  constructor() { }

  startFlow(){
    console.info('flow started.');
  }

  tagCreated(){
    this.hasTags = true;
  }

  dashboardViewed(){
    this.hasViewdDashboard = true;
  }
}
