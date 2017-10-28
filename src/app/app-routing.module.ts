import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { AccountOverviewComponent } from "./account-overview/account-overview.component";
import { AccountViewComponent } from "./account-view/account-view.component";
import { TagTransactionViewComponent } from "./tag-transaction-view/tag-transaction-view.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { TestDataComponent } from './test-data/test-data.component';
import { AboutComponent } from './about/about.component';
import { RegisterViewComponent } from './register-view/register-view.component';
import { LoginViewComponent } from './login-view/login-view.component';
import { AuthGuard } from './auth-guard';
import { LogoutViewComponent } from './logout-view/logout-view.component';
import { CoinOverviewComponent } from './coin-overview/coin-overview.component';
import { CoinViewComponent } from './coin-view/coin-view.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { JobOverviewComponent } from './job-overview/job-overview.component';
import { JobViewComponent } from './job-view/job-view.component';
import { LogOverviewComponent } from './log-overview/log-overview.component';
import { LogViewComponent } from './log-view/log-view.component';

const routes: Routes = [
  
  {
    path: 'accounts',
    component: AccountOverviewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'account/:id',
    component: AccountViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'transaction/:account/:id/tag',
    component: TagTransactionViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'test',
    component: TestDataComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path:'register',
    component: RegisterViewComponent
  },
  {
    path: 'login',
    component: LoginViewComponent
  },
  {
    path: 'logout',
    component: LogoutViewComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: AdminDashboardComponent,
      },
      {
        path: 'coins',
        component: CoinOverviewComponent
      },
      {
        path: 'coin/:id',
        component: CoinViewComponent,
      },
      {
        path: 'jobs',
        component: JobOverviewComponent,
      },
      {
        path: 'job/:id',
        component: JobViewComponent,
      },
      {
        path: 'logs',
        component: LogOverviewComponent,
      },
      {
        path: 'log/:id',
        component: LogViewComponent,
      },
      {
        path: 'coin/:id',
        component: CoinViewComponent,
      }]
  },
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
