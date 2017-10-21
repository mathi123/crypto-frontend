import { Injectable }     from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ConfigurationService } from './server-api/configuration.service';
import { TokenService } from './server-api/token-service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigurationService, private router: Router,
        private tokenService: TokenService){
      
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (this.configService.LoggedInSubject.value) { return true; }

    // Store the attempted URL for redirecting
    this.tokenService.setRedirectUrl(url);

    // Navigate to the login page with extras
    this.router.navigate(['/login']);
    return false;
  }

}