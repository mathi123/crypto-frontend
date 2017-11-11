import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpClient} from '@angular/common/http';
import {ConfigurationService} from './configuration.service';
import {Credentials} from '../models/credentials';
import 'rxjs/add/operator/do';
import {Router} from '@angular/router';
import {SocketManagerService} from '../server-socket/socket-manager.service';
import { Logger } from '../logger';

@Injectable()
export class TokenService {
    private redirectUrl = '/home';

    constructor(private httpClient: HttpClient, private config: ConfigurationService,
                private router: Router, private feedback: SocketManagerService, private logger: Logger) {
    }

    public login(credentials: Credentials) {
        return this.httpClient.post(`${this.config.getApiUrl()}/token`, credentials, {observe: 'response'})
            .do(resp => this.setToken(resp))
            .do(resp => this.loadContext())
            .do(resp => this.openSocket())
            .do(resp => this.navigateAfterLogin())
            .map(p => true);
    }

    public setRedirectUrl(url) {
        this.logger.info(`setting redirect url: ${url}`);
        this.redirectUrl = url;
    }

    private openSocket() {
        this.logger.verbose('initializing socket');
        this.feedback.init();
    }

    private setToken(resp) {
        const token = resp.headers.get('Authorization');

        this.logger.verbose(token);

        this.config.setToken(token);
    }

    private loadContext(){
        this.logger.verbose('loading context');
        this.config.loadContext();
    }

    private navigateAfterLogin(){
        this.logger.verbose(`navigate away from login form to ${this.redirectUrl}`);
        this.router.navigateByUrl(this.redirectUrl);
    }
}
