import { Component, OnInit, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Transaction } from '../models/transaction';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Account } from '../models/account';
import { TransactionService } from '../server-api/transaction.service';
import { AccountService } from '../server-api/account.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { Subscription } from 'rxjs/Subscription';
import { Logger } from '../logger';
import {ActivatedRoute} from '@angular/router';
import { FileCacheService } from '../server-api/file-cache.service';

@Component({
  selector: 'app-transaction-overview',
  templateUrl: './transaction-overview.component.html',
  styleUrls: ['./transaction-overview.component.css']
})
export class TransactionOverviewComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private hasData = false;
  private accountId: string = null;

  @Input()
  public isSelected = false;

  @Input()
  public account: Account = new Account();

  public transactions: Transaction[];
  public displayedColumns = [];
  public dataSource: ExampleDataSource | null;
  public selection = new SelectionModel<string>(true, []);
  public isLoading = true;
  public total: number;

  private routeParamsSubscription: Subscription;

  constructor(private router: Router, private route: ActivatedRoute, private transactionService: TransactionService,
    private dialogService: MatDialog, private fileCacheService: FileCacheService,
    private accountService: AccountService, private logger: Logger) { }

  ngOnInit() {
    this.buildColumnList();
    this.routeParamsSubscription = this.route.params.subscribe(params => this.handleRouteParams(params));
  }
  ngOnDestroy() {
    this.routeParamsSubscription.unsubscribe();
  }

  private handleRouteParams(params) {
    const id = params['accountId'];
    if (id !== undefined && id !== null && id !== '0') {
      this.logger.info(id);
      this.accountId = id;
      this.reload();
    } else {
      this.logger.error('no accountId found');
    }
  }

  public reload() {
    if (this.accountId !== null && (this.isSelected  || !this.hasData)) {
      this.logger.verbose(`reloading data for account with id ${this.accountId}`);
      this.isLoading = true;
      this.accountService.readById(this.accountId)
        .subscribe((account) => this.accountRead(account));
    }
  }
  private accountRead(account) {
    const previousAccount = this.account;

    this.account = account;

    if (previousAccount.updatedAt !== account.updatedAt || !this.hasData) {
      this.hasData = true;
      previousAccount.state = account.state;
      previousAccount.updatedAt = account.updatedAt;
      this.transactionService.read(this.account.id)
        .subscribe(transactions => this.showTransactions(transactions));
    }

    this.loadImage(account);
  }

  private showTransactions(transactions: Transaction[]) {
    this.transactions = transactions;
    this.dataSource = new ExampleDataSource(this.transactions);
    this.isLoading = false;
    this.total = transactions.reduce((curr, txn) => curr + parseFloat(txn.amount), 0);
  }

  buildColumnList() {
    this.displayedColumns = ['select'];
    this.displayedColumns.push('date', 'amount');
  }

  isAllSelected(): boolean {
    if (!this.dataSource) { return false; }
    if (this.selection.isEmpty()) { return false; }

    // if (this.filter.nativeElement.value) {
    //  return this.selection.selected.length == this.dataSource.renderedData.length;
    // } else {
      return this.selection.selected.length === this.transactions.length;
   // }
  }

  masterToggle() {
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
    console.log('tag buy in');

    if (this.selection.selected.length === 1){
      const id = this.selection.selected[0];
      console.log(id);
      const transaction = this.transactions.filter(t => t.id === id)[0];
    }
  }

  tagBuyOut() {
    console.log('tag buy out');

        if (this.selection.selected.length === 1){
          const id = this.selection.selected[0];
        }
  }

  delete() {
    const options = {
      data: {
        title: 'Confirm',
        message: 'Are you sure you want to delete this account?'
      }
    };
    const dialogRef = this.dialogService.open(ConfirmDialogComponent, options);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true){
        this.accountService.delete(this.account.id)
          .subscribe((success) => this.router.navigate(['accounts']));
      }
    });
  }

  edit(){
    this.router.navigate(['account', this.account.id]);
  }

  private loadImage(account: Account) {
    if (account.coinFileId) {
      this.fileCacheService.read(account.coinFileId)
        .subscribe(data => account.image = data);
    }
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
