import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { AccountOverviewComponent } from "./account-overview/account-overview.component";
import { AccountViewComponent } from "./account-view/account-view.component";
import { TagTransactionViewComponent } from "./tag-transaction-view/tag-transaction-view.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { TestDataComponent } from './test-data/test-data.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  
  {
    path: 'accounts',
    component: AccountOverviewComponent
  },
  {
    path: 'account/:id',
    component: AccountViewComponent
  },
  {
    path: 'transaction/:account/:id/tag',
    component: TagTransactionViewComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
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
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
