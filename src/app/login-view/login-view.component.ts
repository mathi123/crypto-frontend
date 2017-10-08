import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { Credentials } from '../models/credentials';
import { TokenService } from '../server-api/token-service';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.css']
})
export class LoginViewComponent implements OnInit {
  credentials: Credentials = new Credentials();

  constructor(private router: Router, private location: Location, private tokenService: TokenService) { }

  ngOnInit() {
  }

  public cancel(){
    console.debug('cancel login');
    this.credentials = new Credentials();

    this.location.back();
  }
  
  public login(){
      console.debug('logging in');
      this.tokenService.login(this.credentials)
        .subscribe(() => {
          console.log("logged in");
          this.router.navigateByUrl("/home");
        }, () => this.showFailedFeedback())   ;   
  }
  private showFailedFeedback(): any {
    console.error("Could not login");
  }
}
