import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';

import { HttpModule } from '@angular/http';
import { MaterialModule, MdTableModule, MdNativeDateModule, } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HomeComponent } from './home/home.component';
import { BuildDashboardService } from "./build-dashboard.service";
import { AccountOverviewComponent } from './account-overview/account-overview.component';
import { AccountService } from "./account.service";
import { AccountViewComponent } from './account-view/account-view.component';
import { CryptoCurrenciesService } from "./crypto-currencies.service";
import { HttpClientModule } from "@angular/common/http";
import { TransactionOverviewComponent } from './transaction-overview/transaction-overview.component';
import { TagTransactionViewComponent } from './tag-transaction-view/tag-transaction-view.component';
import { TransactionsService } from "./transactions.service";
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { FlexLayoutModule } from "@angular/flex-layout";
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountListComponent } from './account-list/account-list.component';
import { DashboardConfigurationComponent } from './dashboard-configuration/dashboard-configuration.component';
import { DashboardSummaryComponent } from './dashboard-summary/dashboard-summary.component';
import { DashboardContentComponent } from './dashboard-content/dashboard-content.component';
import { DashboardDataService } from "./dashboard-data.service";
import { TestDataComponent } from './test-data/test-data.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AccountOverviewComponent,
    AccountViewComponent,
    TransactionOverviewComponent,
    TagTransactionViewComponent,
    ConfirmDialogComponent,
    DashboardComponent,
    AccountListComponent,
    DashboardConfigurationComponent,
    DashboardSummaryComponent,
    DashboardContentComponent,
    TestDataComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    MdTableModule,
    FlexLayoutModule,
    MdNativeDateModule,
    ChartsModule
  ],
  entryComponents: [ConfirmDialogComponent],
  providers: [BuildDashboardService, AccountService, CryptoCurrenciesService, TransactionsService, DashboardDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
