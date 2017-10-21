import { Component, OnInit } from '@angular/core';
import { CoinService } from '../server-api/coin.service';
import { Logger } from '../logger';
import { Coin } from '../models/coin';
import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coin-overview',
  templateUrl: './coin-overview.component.html',
  styleUrls: ['./coin-overview.component.css']
})
export class CoinOverviewComponent implements OnInit {
  private displayedColumns = ['code', 'description', 'isActive', 'coinType', 'decimals'];

  private dataSource: CoinDataSource | null;
  constructor(private coinService: CoinService, private logger: Logger, private router: Router) { }

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
    this.dataSource = new CoinDataSource(coins);
  }

  private rowClicked(coin: Coin){
    this.logger.verbose('row clicked');
    this.router.navigate(['coin', coin.id]);
  }
}


export class CoinDataSource extends DataSource<any> {
  constructor(private coins: Coin[]) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Coin[]> {
    console.log('connect called');

    return Observable.from(Observable.of(this.coins));
  }

  disconnect() {}
}
