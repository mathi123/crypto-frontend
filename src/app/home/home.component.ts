import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { BuildDashboardService } from "../build-dashboard.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private buildDashboardService:BuildDashboardService, private router:Router) { }

  ngOnInit() {
    this.buildDashboardService.startFlow();
  }

  nextStep(){
    console.log('next step clicked.');

    this.router.navigate(['accounts']);
  }

}
