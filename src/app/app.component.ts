import { Component, ViewChild, OnInit } from '@angular/core';
import { ConfigurationService } from './server-api/configuration.service';
import { MdDrawer } from '@angular/material';
import { MenuItem } from './models/menu-item';
import { Router } from '@angular/router';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  loggedIn: boolean;
  menuOpen: boolean = false;
  menuItems: MenuItem[] = [
    new MenuItem("Register", "/register", false, true, "create"),
    new MenuItem("Login", "/login", false, true, "account_circle"),
    new MenuItem("Accounts", "/accounts", true, false, "list"),
    new MenuItem("Dashboard", "/dashboard", true, false, "show_chart"),
    new MenuItem("About", "/about", false, false,"info_outline"),
    new MenuItem('Logout', "/logout", true, false, "power_settings_new")
  ];

  @ViewChild('sideNavMenu') 
  public drawer: MdDrawer;

  constructor(public media:ObservableMedia, private configurationService: ConfigurationService, private router: Router){
    media.asObservable()
    .subscribe((change:MediaChange) => {
      console.log(change ? `'${change.mqAlias}' = (${change.mediaQuery})` : "")

    });
  }

  ngOnInit(): void {
    this.configurationService.LoggedInSubject.subscribe((v) => this.logginChanged(v));
  }
  public state = '';

  logginChanged(isLoggedInd: boolean){
    this.loggedIn = isLoggedInd;
  }

  toggleMenu(){
    console.log("toggling menu");
    this.drawer.open();
    //this.menuService.toggle();
  }

  closeMenu(){
    this.drawer.close();
    //this.menuService.close();
  }

  navigateTo(menuItem: MenuItem){
    console.log("navigating to "+menuItem.route);
    this.drawer.close();
    this.router.navigateByUrl(menuItem.route);
  }
}
