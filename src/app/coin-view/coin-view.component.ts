import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoinService } from '../server-api/coin.service';
import { Subscription } from 'rxjs/Subscription';
import { Coin } from '../models/coin';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Logger } from '../logger';
import { Location } from "@angular/common";
import { CoinType } from '../models/coin-type';

@Component({
  selector: 'app-coin-view',
  templateUrl: './coin-view.component.html',
  styleUrls: ['./coin-view.component.css']
})
export class CoinViewComponent implements OnInit {
  private coin: Coin = new Coin();
  private coinTypes: CoinType[] = [
    new CoinType("other", "Other"),
    new CoinType("erc20contract", "Ethereum Erc20 contract")
  ];
  private enableSyncButton = true;

  private routeParamsSubscription: Subscription;
  
  constructor(private router: Router, private location: Location, private route: ActivatedRoute,
    private coinService: CoinService, private dialogService: MatDialog, private logger: Logger) { }
      
  ngOnInit() {
    this.routeParamsSubscription = this.route.params.subscribe(params => {
      let id = params['id'];

      if(id === undefined || id === null || id === '0'){
        this.coin = new Coin();
      }else{
        this.coinService.readById(id)
          .subscribe(coin => this.reloadCoin(coin));
      }
    });
  }

  private reloadCoin(coin: Coin){
    this.coin = coin;
  }

  private deleteCoin(){
    let options = {
      data: {
        title: "Confirm",
        message: "Are you sure you want to delete this coin? All accounts with this coin will be deleted."
      }
    };
    let dialogRef = this.dialogService.open(ConfirmDialogComponent, options);

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        this.coinService.delete(this.coin.id)
          .subscribe((success) => this.location.back());
      }
    });
  }

  private save(){
    if(this.coin.id === null || this.coin.id === undefined){
      this.coinService.create(this.coin)
        .subscribe((coin) => {
          this.location.back();
          }, (err) => this.errorFeedback(err));
    }else{
      this.coinService.update(this.coin)
        .subscribe(() => {
        this.location.back();
        }, (err) => this.errorFeedback(err));
    }
  }

  private errorFeedback(err:Error){
    this.logger.error('error in coin view', err);
  }

  private cancel(){
    this.location.back();
  }

  private importErc20Coin(){
    this.logger.verbose("syncing erc20 coins");
    
    let options = {
      data: {
        title: "Confirm",
        message: "Are you sure you want to import all transactions?"
      }
    };
    let dialogRef = this.dialogService.open(ConfirmDialogComponent, options);

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){ 
        this.enableSyncButton = false;
        this.coinService.importErc20Coin(this.coin)
          .subscribe(() => this.logger.info("sync started"), 
                     (err) => this.logger.error("sync start failed", err));
      }
    });
  }
}
