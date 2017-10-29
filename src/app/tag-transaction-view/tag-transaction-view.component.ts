import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { Tag } from '../models/tag';
import { AccountCacheService } from '../cache/account-cache.service';
import { TagCacheService } from '../cache/tag-cache-service';
import { Subscription } from 'rxjs/Subscription';
import { Transaction } from '../models/transaction';

@Component({
  selector: 'app-tag-transaction-view',
  templateUrl: './tag-transaction-view.component.html',
  styleUrls: ['./tag-transaction-view.component.css']
})
export class TagTransactionViewComponent implements OnInit {
  public transaction: Transaction;
  public tag:Tag;
  public tags: Tag[] = [];
  public amount: 0;
  private predefinedTag: string = null;

  private routeParamsSubscription: any;
  private tagSubscription: Subscription;
  private queryParamsSubscription: any;

  constructor(private routeService: Router, private location: Location, private route: ActivatedRoute,
    private accountCacheService: AccountCacheService, private tagCacheService: TagCacheService) { }
  
  ngOnInit() {
    this.routeParamsSubscription = this.route.params.subscribe(params => {
      let transactionId = params['id'];

      //let account = this.accountCacheService.getById(accountId);
      // this.transaction = this.transactionsService.getTransaction(account, transactionId);
    });

    this.queryParamsSubscription = this.route.queryParams.subscribe(params=> {
      let predefinedTag = params['tag'];

      if(predefinedTag !== undefined){
        this.predefinedTag = predefinedTag;
      }
    });

    this.tagSubscription = this.tagCacheService.getTags()
      .subscribe(tags => this.reloadTags(tags));
  }

  reloadTags(tags: Tag[]){
    this.tags = tags;
    if(this.predefinedTag !== null){
      this.tag = this.tags.filter(t => t.code === this.predefinedTag)[0];
    }
  }

  ngOnDestroy() {
    this.tagSubscription.unsubscribe();
    this.queryParamsSubscription.unsubscribe();
    this.routeParamsSubscription.unsubscribe();
  }

  public save(){
    // this.transaction.tagAmount = this.amount;
    // this.transaction.tagType = this.tag;
    this.location.back();
  }

  public cancel(){
    this.location.back();
  }
}
