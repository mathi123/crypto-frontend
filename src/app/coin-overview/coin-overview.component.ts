import { Component, OnInit, ViewChild } from '@angular/core';
import { CoinService } from '../server-api/coin.service';
import { Logger } from '../logger';
import { Coin } from '../models/coin';
import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { MatSort, MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-coin-overview',
  templateUrl: './coin-overview.component.html',
  styleUrls: ['./coin-overview.component.css']
})
export class CoinOverviewComponent implements OnInit {
  private displayedColumns = ['code', 'description', 'isActive', 'coinType', 'transactionCount', 'state', 'decimals', 'firstBlockSynchronized', 'lastBlockSynchronized'];
  private enableSyncButton = true;

  @ViewChild(MatSort) sort: MatSort;

  private dataSource: CoinDataSource | null;
  constructor(private coinService: CoinService,  private dialogService: MatDialog,
    private logger: Logger, private router: Router) { }

  ngOnInit() {
    this.logger.verbose('loading coins');
    this.coinService.read()
      .subscribe(coins => this.reloadCoins(coins),
                 err => console.error(err));
  }

  private add(){
    this.router.navigate(['/coin', '0']);
  }

  private reloadCoins(coins: Coin[]){
    this.logger.verbose('coins loaded from server, updating data source');
    this.logger.verbose(JSON.stringify(coins));
    this.dataSource = new CoinDataSource(Observable.from(Observable.of(coins)), this.sort);
  }

  private rowClicked(coin: Coin){
    this.logger.verbose('row clicked');
    this.router.navigate(['coin', coin.id]);
  }

  private syncErc20(){
    this.logger.verbose("syncing erc20 coins");
    
    let options = {
      data: {
        title: "Confirm",
        message: "Are you sure you want to run synchronization with Bittrex erc20 coins? This process will automatically update the coin list."
      }
    };
    let dialogRef = this.dialogService.open(ConfirmDialogComponent, options);

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){ 
        this.enableSyncButton = false;
        this.coinService.importErc20()
          .subscribe(() => this.logger.info("sync started"), (err) => this.logger.error("sync start failed", err));
      }
    });
  }
}

export class CoinDataSource extends DataSource<any> {
  private list: Coin[] = null;

  constructor(private coins: Observable<Coin[]>, private sort: MatSort) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Coin[]> {
    console.log('connect called');
    const streams = [
      this.coins,
      this.sort.sortChange
    ];

    return Observable.merge(...streams)
          .map((data:Coin[]) => this.returnData(data));
  }

  disconnect() {}

  private returnData(data:Coin[]):Coin[]{
    if(this.list === null)
      this.list = data;

    let sortColumn = this.sort.active || 'description';

    return this.list.sort((a,b) => ((a[sortColumn] < b[sortColumn]) ? 1 : -1) * (this.sort.direction == 'asc' ? 1 : -1));
  }
}
