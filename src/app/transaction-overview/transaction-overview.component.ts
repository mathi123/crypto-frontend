import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { DataSource } from "@angular/cdk/collections";
import { Transaction } from "../models/transaction";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { MatDialog } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { Router } from "@angular/router";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";
import { Account } from '../models/account';
import { TransactionService } from '../server-api/transaction.service';
import { AccountService } from '../server-api/account.service';

@Component({
  selector: 'app-transaction-overview',
  templateUrl: './transaction-overview.component.html',
  styleUrls: ['./transaction-overview.component.css']
})
export class TransactionOverviewComponent implements OnInit {
  @Input()
  public account: Account = null;

  public transactions: Transaction[];
  public displayedColumns = [];
  public dataSource: ExampleDataSource | null;
  public selection = new SelectionModel<string>(true, []);

  constructor(private router: Router, private transactionService: TransactionService, private dialogService: MatDialog,
    private accountService: AccountService) { }

  ngOnInit() {
    this.buildColumnList();

    if(this.account === null){
      // show all accounts!
      //this.dataSource = new ExampleDataSource(this.transactionsService, null);
    }
    else{
      // show some accounts!
      this.transactionService.read(this.account.id)
        .subscribe(transactions => this.showTransactions(transactions));
    }
  }

  private showTransactions(transactions){
    this.transactions = transactions;
    this.dataSource = new ExampleDataSource(this.transactions);
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
      return this.selection.selected.length == this.transactions.length;
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
      this.transactions.forEach(data => this.selection.select(data.id));
    }
  }

  tagBuyIn(){
    console.log("tag buy in");

    if(this.selection.selected.length == 1){
      let id = this.selection.selected[0];
      console.log(id);
      let transaction = this.transactions.filter(t => t.id == id)[0];
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
        this.accountService.delete(this.account.id)
          .subscribe((success) => console.log("deleted"));
      }
    });
  }

  edit(){
    this.router.navigate(['account', this.account.id]);
  }
}

export class ExampleDataSource extends DataSource<any> {
  constructor(private transactions: Transaction[]) {
    super();
  }

  connect(): Observable<Transaction[]> {
    return Observable.from(Observable.of(this.transactions));
  }

  disconnect() {}
}
