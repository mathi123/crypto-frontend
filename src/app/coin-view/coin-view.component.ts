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
import { FileService } from '../server-api/file.service';

@Component({
  selector: 'app-coin-view',
  templateUrl: './coin-view.component.html',
  styleUrls: ['./coin-view.component.css']
})
export class CoinViewComponent implements OnInit {
  public coin: Coin = new Coin();
  public coinTypes: CoinType[] = [
    new CoinType("other", "Other"),
    new CoinType("erc20contract", "Ethereum Erc20 contract")
  ];
  public imageData:string = null;
  public imageInput:string = null;
  public enableSyncButton = true;

  private routeParamsSubscription: Subscription;
  private fileReader: FileReader = new FileReader();
  private uploadFile: boolean = false;

  constructor(private router: Router, private location: Location, private route: ActivatedRoute,
    private coinService: CoinService, private dialogService: MatDialog, private logger: Logger,
    private fileService: FileService) { 
      this.fileReader.onload = () => this.fileReaderFinished();
  }
      
  ngOnInit() {
    this.routeParamsSubscription = this.route.params.subscribe(params => {
      let id = params['id'];

      if(id === undefined || id === null || id === '0'){
        this.coin = new Coin();
      }else{
        this.coinService.readById(id)
          .subscribe(coin => this.refresh(coin),
                     err => this.errorFeedback(err));
      }
    });
  }

  private refresh(coin: Coin){
    this.coin = coin;

    if(coin.fileId !== null && coin.fileId !== undefined){
      this.fileService.readById(coin.fileId)
        .subscribe(image => this.refreshImage(image),
                   err => this.errorFeedback(err));
    }
  }

  private refreshImage(data: string){
    this.imageData = data;
  }

  public deleteCoin(){
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

  public fileChanged(event: any){
    let input = event.srcElement;
    let file = input.files[0] || null;

    if(file === null){
      this.imageData = "";
    }else{
      this.fileReader.readAsDataURL(file);
    }
  }

  private fileReaderFinished(){
    this.imageData = this.fileReader.result;
    this.uploadFile = true;
  }

  public save(){
    this.logger.info(this.imageInput);
    if(this.coin.id === null || this.coin.id === undefined){
      this.coinService.create(this.coin)
        .subscribe(coinId => this.uploadImageAndGoBack(coinId), 
                   err => this.errorFeedback(err));
    }else{
      this.coinService.update(this.coin)
        .subscribe(() => this.uploadImageAndGoBack(this.coin.id), 
                   err => this.errorFeedback(err));
    }
  }

  private uploadImageAndGoBack(coinId: string){
    if(this.uploadFile){
      this.coinService.updateImage(coinId, this.imageData)
        .subscribe(() => this.leave(),
                   err => this.errorFeedback(err));
    }else{
      this.leave();
    }
  }

  private leave(){
    this.location.back();
  }

  private errorFeedback(err:Error){
    this.logger.error('error in coin view', err);
  }

  public cancel(){
    this.location.back();
  }

  public importErc20Coin(){
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
