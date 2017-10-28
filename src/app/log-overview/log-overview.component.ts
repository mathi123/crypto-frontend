import { Component, OnInit, ViewChild } from '@angular/core';
import { LogService } from '../server-api/log.service';
import { Log } from '../models/log';
import { Observable } from 'rxjs/Observable';
import { MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { Logger } from '../logger';
import { CountResult } from '../models/count-result';

@Component({
  selector: 'app-log-overview',
  templateUrl: './log-overview.component.html',
  styleUrls: ['./log-overview.component.css']
})
export class LogOverviewComponent implements OnInit {
  private displayedColumns = ['createdAt', 'type', 'log'];
  private levels = ['verbose', 'info', 'warning', 'error'];
  private selectedLevel = 'verbose';

  @ViewChild(MatSort) sort: MatSort;

  private dataSource: CoinDataSource | null;
  constructor(private logService: LogService,
    private logger: Logger, private router: Router) { }

  ngOnInit() {
    this.logger.verbose('loading logs');
    this.reload();
  }

  private reload(){
    this.logService.read(0, 25, this.selectedLevel)
      .subscribe(logs => this.reloadData(logs),
               err => this.handleError(err));
  }

  private reloadData(data: CountResult<Log>){
    this.logger.verbose('logs loaded from server, updating data source');
    //this.logger.verbose(JSON.stringify(data.records));
    this.dataSource = new CoinDataSource(Observable.from(Observable.of(data.records)), this.sort);
  }

  private handleError(error: Error){
    this.logger.error('could not load logs', error);
  }

  private rowClicked(log: Log){
    this.logger.verbose('row clicked');
    this.router.navigate(['admin/log', log.id]);
  }
}

export class CoinDataSource extends DataSource<any> {
  private list: Log[] = null;

  constructor(private coins: Observable<Log[]>, private sort: MatSort) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Log[]> {
    console.log('connect called');
    const streams = [
      this.coins,
      this.sort.sortChange
    ];

    return Observable.merge(...streams)
          .map((data:Log[]) => this.returnData(data));
  }

  disconnect() {}

  private returnData(data:Log[]):Log[]{
    if(this.list === null)
      this.list = data;

    let sortColumn = this.sort.active || 'createdAt';

    return this.list.sort((a,b) => ((a[sortColumn] < b[sortColumn]) ? 1 : -1) * (this.sort.direction == 'asc' ? 1 : -1));
  }
}
