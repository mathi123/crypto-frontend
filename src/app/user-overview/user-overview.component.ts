import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material';
import { UserService } from '../server-api/user.service';
import { Logger } from '../logger';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk/collections';

@Component({
  selector: 'app-user-overview',
  templateUrl: './user-overview.component.html',
  styleUrls: ['./user-overview.component.css']
})
export class UserOverviewComponent implements OnInit {
  public displayedColumns = ['createdAt', 'name', 'email', 'isAdmin'];

  @ViewChild(MatSort) sort: MatSort;

  public dataSource: UserDataSource | null;
  constructor(private userService: UserService,
    private logger: Logger, private router: Router) { }

  ngOnInit() {
    this.logger.verbose('loading users');
    this.reload();
  }

  private reload(){
    this.userService.read()
      .subscribe(records => this.refresh(records),
               err => this.handleError(err));
  }

  private refresh(data: User[]){
    this.logger.verbose('users loaded from server, updating data source');
    //this.logger.verbose(JSON.stringify(data.records));
    this.dataSource = new UserDataSource(Observable.from(Observable.of(data)), this.sort);
  }

  private handleError(error: Error){
    this.logger.error('could not load jobs', error);
  }

  public rowClicked(record: User){
    this.logger.verbose('row clicked');
    this.router.navigate(['admin/user', record.id]);
  }
}

export class UserDataSource extends DataSource<any> {
  private list: User[] = null;

  constructor(private coins: Observable<User[]>, private sort: MatSort) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<User[]> {
    const streams = [
      this.coins,
      this.sort.sortChange
    ];

    return Observable.merge(...streams)
          .map((data:User[]) => this.returnData(data));
  }

  disconnect() {}

  private returnData(data:User[]):User[]{
    if(this.list === null)
      this.list = data;

    let sortColumn = this.sort.active || 'createdAt';

    return this.list.sort((a,b) => ((a[sortColumn] < b[sortColumn]) ? 1 : -1) * (this.sort.direction == 'asc' ? 1 : -1));
  }
}
