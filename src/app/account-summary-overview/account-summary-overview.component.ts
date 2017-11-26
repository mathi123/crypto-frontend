import { Component, OnInit } from '@angular/core';
import { AccountSummaryService } from '../server-api/account-summary.service';
import { AccountSummary } from '../models/account-summary';
import { Logger } from '../logger';
import { FileCacheService } from '../server-api/file-cache.service';

@Component({
  selector: 'app-account-summary-overview',
  templateUrl: './account-summary-overview.component.html',
  styleUrls: ['./account-summary-overview.component.css']
})
export class AccountSummaryOverviewComponent implements OnInit {
  public accounts: AccountSummary[] = [];

  constructor(private accountSummaryService: AccountSummaryService,
    private logger: Logger, private fileCacheService: FileCacheService) { }

  public ngOnInit() {
    this.reload();
  }

  public reload() {
    this.accountSummaryService.read()
      .subscribe(sum => this.refresh(sum),
                 err => this.handleError(err));
  }

  private refresh(summary: AccountSummary[]) {
    this.logger.verbose('Accounts loaded', summary);
    this.accounts = summary;

    for (const account of summary){
      this.loadImage(account);
    }
  }

  private loadImage(account: AccountSummary) {
    if (account.coin.fileId) {
      this.fileCacheService.read(account.coin.fileId)
        .subscribe(data => account.image = data);
    }
  }

  private handleError(err: Error) {
    this.logger.error('Could not load account summary', err);
  }
}
