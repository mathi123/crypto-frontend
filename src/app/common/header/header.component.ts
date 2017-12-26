import {Component, OnInit, ViewChild} from '@angular/core';
import {MenuItem} from '../../models/menu-item';
import {MenuService} from '../../menu.service';
import {MediaChange, ObservableMedia} from '@angular/flex-layout';
import {MatDrawer} from '@angular/material';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    private menuServiceSubscription: Subscription;

    public menuItems: MenuItem[] = [];
    public state = '';

    @ViewChild('sideNavMenu')
    public drawer: MatDrawer;

    constructor(private media: ObservableMedia,
                private menuService: MenuService,
                private router: Router) {

        media.asObservable()
            .subscribe((change: MediaChange) => {
                console.log(change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '');
            });
    }

    ngOnInit() {
        this.menuServiceSubscription =
            this.menuService.menu.subscribe((menuItems) => this.menuItems = menuItems);
    }

    toggleMenu() {
        console.log('toggling menu');
        this.drawer.open();
    }

    navigateTo(menuItem: MenuItem) {
        console.log('navigating to ' + menuItem.route);
        this.drawer.close();
        this.router.navigateByUrl(menuItem.route);
    }

}
