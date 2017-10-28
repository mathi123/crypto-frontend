import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { JobOverviewComponent } from './job-overview/job-overview.component';
import { JobViewComponent } from './job-view/job-view.component';
import { LogViewComponent } from './log-view/log-view.component';
import { LogOverviewComponent } from './log-overview/log-overview.component';
import { LogService } from './server-api/log.service';

import {HomeComponent} from './home/home.component';
import {AccountOverviewComponent} from './account-overview/account-overview.component';
import {AccountViewComponent} from './account-view/account-view.component';
import {HttpClientModule} from "@angular/common/http";
import {TransactionOverviewComponent} from './transaction-overview/transaction-overview.component';
import {TagTransactionViewComponent} from './tag-transaction-view/tag-transaction-view.component';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import {DashboardComponent} from './dashboard/dashboard.component';
import {AccountListComponent} from './account-list/account-list.component';
import {DashboardConfigurationComponent} from './dashboard-configuration/dashboard-configuration.component';
import {DashboardSummaryComponent} from './dashboard-summary/dashboard-summary.component';
import {DashboardContentComponent} from './dashboard-content/dashboard-content.component';
import {TestDataComponent} from './test-data/test-data.component';
import {ChartsModule} from 'ng2-charts/ng2-charts';
import {AboutComponent} from './about/about.component';
import {RegisterViewComponent} from './register-view/register-view.component';
import {ConfigurationService} from './server-api/configuration.service';
import {CurrencyService} from './server-api/currency.service';
import {UserService} from './server-api/user.service';
import {LoginViewComponent} from './login-view/login-view.component';
import {TokenService} from './server-api/token-service';
import {TagService} from './server-api/tag.service';
import {AccountService} from './server-api/account.service';
import {AccountCacheService} from './cache/account-cache.service';
import {CoinCacheService} from './cache/coin-cache.service';
import {TransactionService} from './server-api/transaction.service';
import {TransactionCacheService} from './cache/transaction-cache.service';
import {TagCacheService} from './cache/tag-cache-service';
import {CurrencyCacheService} from './cache/currency-cache.service';
import {CoinService} from './server-api/coin.service';
import {AuthGuard} from './auth-guard';
import {SocketManagerService} from './server-socket/socket-manager.service';
import {LogoutViewComponent} from './logout-view/logout-view.component';
import {Logger} from './logger';
import {CoinOverviewComponent} from './coin-overview/coin-overview.component';
import {CoinViewComponent} from './coin-view/coin-view.component';
import {AdminDashboardComponent} from './admin-dashboard/admin-dashboard.component';
import {MaterialModule} from './material.module';
import { JobService } from './server-api/job.service';
import { UserOverviewComponent } from './user-overview/user-overview.component';
import { UserViewComponent } from './user-view/user-view.component';

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
        TestDataComponent,
        AboutComponent,
        RegisterViewComponent,
        LoginViewComponent,
        LogoutViewComponent,
        CoinOverviewComponent,
        CoinViewComponent,
        AdminDashboardComponent,
        JobOverviewComponent,
        JobViewComponent,
        LogViewComponent,
        LogOverviewComponent,
        UserOverviewComponent,
        UserViewComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        ChartsModule,
        MaterialModule
    ],
    entryComponents: [ConfirmDialogComponent],
    providers: [ConfigurationService, CurrencyService, CurrencyCacheService, AuthGuard,
        UserService, TokenService, TagService, TagCacheService, AccountService,
        AccountCacheService, CoinCacheService, CoinService, TransactionService,
        TransactionCacheService, SocketManagerService, Logger, LogService, JobService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
