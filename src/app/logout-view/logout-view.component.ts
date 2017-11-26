import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Credentials } from '../models/credentials';
import { TokenService } from '../server-api/token-service';
import { ConfigurationService } from '../server-api/configuration.service';
import { Logger } from '../logger';

@Component({
  selector: 'app-logout-view',
  templateUrl: './logout-view.component.html'
})
export class LogoutViewComponent implements OnInit {
  public credentials: Credentials = new Credentials();

  constructor(private configService: ConfigurationService, private logger: Logger) { }

  ngOnInit() {
    this.configService.logOut();
    this.logger.verbose('logged out.');
  }
}
