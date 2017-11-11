import { Component, ViewChild, OnInit } from '@angular/core';
import { ConfigurationService } from './server-api/configuration.service';
import { MatDrawer } from '@angular/material';
import { MenuItem } from './models/menu-item';
import { Router } from '@angular/router';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';
import { MenuService } from './menu.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  loggedIn: boolean;
  menuOpen: boolean = false;
  menuItems: MenuItem[] = [];

  private menuServiceSubscription: Subscription;

  public state = '';

  @ViewChild('sideNavMenu') 
  public drawer: MatDrawer;

  constructor(public media:ObservableMedia, private menuService: MenuService, private router: Router){
    media.asObservable()
    .subscribe((change:MediaChange) => {
      console.log(change ? `'${change.mqAlias}' = (${change.mediaQuery})` : "")
    });
  }

  ngOnInit(): void {
    this.menuServiceSubscription = this.menuService.menu.subscribe(menu => this.menuChanged(menu));
  }

  menuChanged(menu: MenuItem[]){
    this.menuItems = menu;
  }

  toggleMenu(){
    console.log("toggling menu");
    this.drawer.open();
    //this.menuService.toggle();
  }

  closeMenu(){
    this.drawer.close();
  }

  navigateTo(menuItem: MenuItem){
    console.log("navigating to "+menuItem.route);
    this.drawer.close();
    this.router.navigateByUrl(menuItem.route);
  }
}
