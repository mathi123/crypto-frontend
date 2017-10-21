import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { DataSource } from "@angular/cdk/collections";
import { Transaction } from "../models/transaction";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { SelectionModel, MdDialog } from "@angular/material";
import { Router } from "@angular/router";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";
import { TransactionCacheService } from '../cache/transaction-cache.service';
import { AccountCacheService } from '../cache/account-cache.service';
import { Account } from '../models/account';

@Component({
  selector: 'app-transaction-overview',
  templateUrl: './transaction-overview.component.html',
  styleUrls: ['./transaction-overview.component.css']
})
export class TransactionOverviewComponent implements OnInit {
  @Input()
  public account: Account = null;

  private transactions: BehaviorSubject<Transaction[]>;
  private displayedColumns = [];
  private dataSource: ExampleDataSource | null;
  private selection = new SelectionModel<string>(true, []);

  constructor(private router: Router, private transactionCacheService: TransactionCacheService, private dialogService: MdDialog,
    private accountCacheService: AccountCacheService) { }

  ngOnInit() {
    this.buildColumnList();

    if(this.account === null){
      // show all accounts!
      //this.dataSource = new ExampleDataSource(this.transactionsService, null);
    }
    else{
      // show some accounts!
      this.transactions = this.transactionCacheService.getTransactions(this.account.id);
      this.dataSource = new ExampleDataSource(this.transactions);
    }
    
  }

  buildColumnList(){
    this.displayedColumns = ['select'];
    this.displayedColumns.push('date', 'amount');
    //this.displayedColumns.push('tag');
  }

  isAllSelected(): boolean {
    //console.debug('Checking if all where selected.');

    if (!this.dataSource) { return false; }
    if (this.selection.isEmpty()) { return false; }

    //if (this.filter.nativeElement.value) {
    //  return this.selection.selected.length == this.dataSource.renderedData.length;
    //} else {
      return this.selection.selected.length == this.transactions.value.length;
   // }
  }

  masterToggle() {
    console.debug('master toggle');

    if (!this.dataSource) { return; }

    if (this.isAllSelected()) {
      this.selection.clear();
    } /*else if (this.filter.nativeElement.value) {
      this.dataSource.renderedData.forEach(data => this.selection.select(data.id));
    }*/ else {
      this.transactions.value.forEach(data => this.selection.select(data.id));
    }
  }

  tagBuyIn(){
    console.log("tag buy in");

    if(this.selection.selected.length == 1){
      let id = this.selection.selected[0];
      console.log(id);
      let transaction = this.transactions.value.filter(t => t.id == id)[0];
      console.log("transaction id: " + transaction.id);

      //this.router.navigateByUrl(`transaction/${transaction.account.name}/${id}/tag?tag=${TagTypes.BuyIn}`);
    }
  }

  tagBuyOut(){
    console.log("tag buy out");
    
        if(this.selection.selected.length == 1){
          let id = this.selection.selected[0];
          console.log(id);
         // let transaction = this.transactionsService.data.filter(t => t.id == id)[0];
         // console.log("transaction id: " + transaction.id);
    
          //this.router.navigateByUrl(`transaction/${transaction.account.name}/${id}/tag?tag=${TagTypes.BuyOut}`);
        }
  }

  delete(){
    let options = {
      data: {
        title: "Confirm",
        message: "Are you sure you want to delete this account?"
      }
    };
    let dialogRef = this.dialogService.open(ConfirmDialogComponent, options);

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        this.accountCacheService.delete(this.account)
          .subscribe((success) => console.log("deleted"));
      }
    });
  }

  edit(){
    this.router.navigate(['account', this.account.id]);
  }
}

export class ExampleDataSource extends DataSource<any> {
  constructor(private transactionSource: BehaviorSubject<Transaction[]>) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Transaction[]> {
    console.log('connect called');

    return this.transactionSource.asObservable();
  }

  disconnect() {}
}
