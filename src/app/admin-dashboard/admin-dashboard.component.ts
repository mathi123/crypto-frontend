import { Component, OnInit } from '@angular/core';
import { AdminService } from '../server-api/admin.service';
import { AdminStatistics } from '../models/admin-statistics';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  public statistics: AdminStatistics = new AdminStatistics();
  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.adminService.read()
      .subscribe(stats => this.refresh(stats));
  }

  private refresh(stats: AdminStatistics) {
    this.statistics = stats;
  }
}
