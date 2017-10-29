import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { Credentials } from '../models/credentials';
import { TokenService } from '../server-api/token-service';
import { SocketManagerService } from '../server-socket/socket-manager.service';
import { ConfigurationService } from '../server-api/configuration.service';

@Component({
  selector: 'app-logout-view',
  templateUrl: './logout-view.component.html'
})
export class LogoutViewComponent implements OnInit {
  public credentials: Credentials = new Credentials();

  constructor(private socketManager: SocketManagerService, private configService: ConfigurationService) { }

  ngOnInit() {
    this.socketManager.close();
    this.configService.logOut();
    console.log("logged out.");
  }
}
