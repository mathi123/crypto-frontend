import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { LogService } from '../server-api/log.service';
import { Log } from '../models/log';
import { Observable } from 'rxjs/Observable';
import { MatSort, PageEvent } from '@angular/material';
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
  public displayedColumns = ['createdAt', 'type', 'log'];
  public levels = ['verbose', 'info', 'warning', 'error'];
  public selectedLevel = 'verbose';
  private _jobId: string = null;

  @ViewChild(MatSort) sort: MatSort;

  @Input()
  public autoReload = true;

  @Input()
  public showTitle = true;

  @Input()
  get jobId(): string{
    return this._jobId;
  }
  set jobId(newVal: string){
    this.logger.info('job id set');
    this._jobId = newVal;
    this.reload();
  }

  public dataSource: CoinDataSource | null;
  
  
  // MdPaginator Inputs
  length = 25;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];
  
  constructor(private logService: LogService,
    private logger: Logger, private router: Router) { }

  ngOnInit() {
    if(this.autoReload){
      this.logger.verbose('loading logs');    
      this.reload();
    }
  }

  public reload(){
    this.logService.read(0, 25, this.selectedLevel, this.jobId)
      .subscribe(logs => this.refresh(logs),
               err => this.handleError(err));
  }

  private refresh(data: CountResult<Log>){
    this.logger.verbose('logs loaded from server, updating data source');
    //this.logger.verbose(JSON.stringify(data.records));
    this.dataSource = new CoinDataSource(Observable.from(Observable.of(data.records)), this.sort);
  }

  private handleError(error: Error){
    this.logger.error('could not load logs', error);
  }

  public rowClicked(log: Log){
    this.logger.verbose('row clicked');
    this.router.navigate(['admin/log', log.id]);
  }

  public pageChanged(a){
    // todo implement me
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

    const sortColumn = this.sort.active || 'createdAt';

    return this.list.sort((a,b) => ((a[sortColumn] < b[sortColumn]) ? 1 : -1) * (this.sort.direction === 'asc' ? 1 : -1));
  }
}
