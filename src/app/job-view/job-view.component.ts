import { Component, OnInit } from '@angular/core';
import { Job } from '../models/job';
import { Router, ActivatedRoute } from '@angular/router';
import { Logger } from '../logger';
import { MatDialog } from '@angular/material';
import { JobService } from '../server-api/job.service';
import { Subscription } from 'rxjs/Subscription';
import { Location } from "@angular/common";

@Component({
  selector: 'app-job-view',
  templateUrl: './job-view.component.html',
  styleUrls: ['./job-view.component.css']
})
export class JobViewComponent implements OnInit {
  private job: Job = new Job();
  private routeParamsSubscription: Subscription;

  constructor(private router: Router, private location: Location, private route: ActivatedRoute,
    private jobService: JobService, private dialogService: MatDialog, private logger: Logger) { }

  ngOnInit() {
    this.routeParamsSubscription = this.route.params.subscribe(params => {
      let id = params['id'];

      if(id === undefined || id === null || id === '0'){
        this.job = new Job();
      }else{
        this.jobService.readById(id)
          .subscribe(job => this.refresh(job));
      }
    });
  }

  private refresh(job: Job){
    this.logger.verbose("data loaded, showing job");
    this.job = job;
  }
}
