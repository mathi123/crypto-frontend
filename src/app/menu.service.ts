import { Injectable } from '@angular/core';
import { ConfigurationService } from './server-api/configuration.service';
import { MenuItem } from './models/menu-item';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Context } from './models/context';

@Injectable()
export class MenuService {
  public menu: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>([]);

  constructor(private configService: ConfigurationService) {
    configService.UserContext.subscribe(context => this.contextChanged(context));
    this.rebuildMenu(null);
  }

  private contextChanged(context: Context){
    this.rebuildMenu(context);
  }

  private rebuildMenu(context: Context){
    let menu: MenuItem[] = [];
    if(context === null){
      menu.push(new MenuItem("Register", "/register", "create"));
      menu.push(new MenuItem("Login", "/login", "account_circle"));
    } else {
      menu.push(new MenuItem("Accounts", "/accounts", "list"));
      menu.push(new MenuItem("Dashboard", "/dashboard", "show_chart"));
    }
    
    if(context !== null && context.isAdmin){
      menu.push(new MenuItem("Admin", "/admin", "build"));
    }
    
    menu.push(new MenuItem("About", "/about", "info_outline"));

    if(context !== null){
      menu.push(new MenuItem('Logout', "/logout", "power_settings_new")); 
    }

    this.menu.next(menu);
  }
}
