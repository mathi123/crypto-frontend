import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { TagTypes } from "../tag-types";
import { Transaction } from "../transaction";
import { TransactionsService } from "../transactions.service";
import { BuildDashboardService } from "../build-dashboard.service";
import { AccountService } from '../account.service';

@Component({
  selector: 'app-tag-transaction-view',
  templateUrl: './tag-transaction-view.component.html',
  styleUrls: ['./tag-transaction-view.component.css']
})
export class TagTransactionViewComponent implements OnInit {
  transaction: Transaction;

  tag:string = '';
  amount: 0;

  private sub: any;
  private queryParamsSub: any;

  tags = [ TagTypes.BuyIn, TagTypes.BuyOut, TagTypes.SwapIn, TagTypes.SwapOut];

  constructor(private routeService: Router, private location: Location, private route: ActivatedRoute, private transactionsService: TransactionsService,
    private buildDashboardService: BuildDashboardService, private accountService: AccountService) { }
  
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      let id = params['id'];
      let accountName = params['account'];

      console.log(accountName);

      let account = this.accountService.getAccount(accountName);
      this.transaction = this.transactionsService.getTransaction(account, id);
    });

    this.queryParamsSub = this.route.queryParams.subscribe(params=> {
      let predefinedTag = params['tag'];

      if(predefinedTag !== undefined){
        this.tag = predefinedTag;
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.queryParamsSub.unsubscribe();
  }

  save(){
    this.transaction.tagAmount = this.amount;
    this.transaction.tagType = this.tag;
    this.buildDashboardService.tagCreated();
    this.location.back();
  }

  cancel(){
    this.location.back();
  }
}
