import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material';
import { JobService } from '../server-api/job.service';
import { Logger } from '../logger';
import { Router } from '@angular/router';
import { Job } from '../models/job';
import { CountResult } from '../models/count-result';
import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk/collections';

@Component({
  selector: 'app-job-overview',
  templateUrl: './job-overview.component.html',
  styleUrls: ['./job-overview.component.css']
})
export class JobOverviewComponent implements OnInit {
  public displayedColumns = ['createdAt', 'name', 'state'];

  @ViewChild(MatSort) sort: MatSort;

  public dataSource: CoinDataSource | null;
  constructor(private jobService: JobService,
    private logger: Logger, private router: Router) { }

  ngOnInit() {
    this.logger.verbose('loading jobs');
    this.reload();
  }

  private reload(){
    this.jobService.read(0, 25)
      .subscribe(logs => this.refresh(logs),
               err => this.handleError(err));
  }

  private refresh(data: CountResult<Job>){
    this.logger.verbose('jobs loaded from server, updating data source');
    this.logger.verbose(JSON.stringify(data.records));
    this.dataSource = new CoinDataSource(Observable.from(Observable.of(data.records)), this.sort);
  }

  private handleError(error: Error){
    this.logger.error('could not load jobs', error);
  }

  public rowClicked(job: Job){
    this.logger.verbose('row clicked');
    this.router.navigate(['admin/job', job.id]);
  }
}

export class CoinDataSource extends DataSource<any> {
  private list: Job[] = null;

  constructor(private coins: Observable<Job[]>, private sort: MatSort) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Job[]> {
    console.log('connect called');
    const streams = [
      this.coins,
      this.sort.sortChange
    ];

    return Observable.merge(...streams)
          .map((data:Job[]) => this.returnData(data));
  }

  disconnect() {}

  private returnData(data:Job[]):Job[]{
    if(this.list === null)
      this.list = data;

    let sortColumn = this.sort.active || 'createdAt';

    return this.list.sort((a,b) => ((a[sortColumn] < b[sortColumn]) ? 1 : -1) * (this.sort.direction == 'asc' ? 1 : -1));
  }
}
