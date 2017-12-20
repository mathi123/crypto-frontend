import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Location, NgFor} from '@angular/common';
import {Credentials} from '../models/credentials';
import {TokenService} from '../server-api/token-service';
import * as HttpStatus from 'http-status-codes';
import {Logger} from '../logger';
import {HttpErrorResponse} from '@angular/common/http';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {Config} from '../config';
import * as environment from '../../environments/environment';

@Component({
    selector: 'app-login-view',
    templateUrl: './login-view.component.html',
    styleUrls: ['./login-view.component.css']
})
export class LoginViewComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    showError = false;

    constructor(private location: Location,
                private logger: Logger,
                private tokenService: TokenService) {
    }

    ngOnInit() {
        this.loginForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.pattern(Config.EMAIL_REGEX)]),
            password: new FormControl('', [Validators.required, Validators.minLength(Config.PASSWORD_LENGTH)]),
        });
        this.loginForm.valueChanges.subscribe(() => {
            // Login failed and error message is shown.
            if (this.loginForm.valid && this.showError) {
                this.showError = false;
            }
        });
        if (!environment.environment.production) {
            this.login({ email: 'colpaert.mathias@gmail.com', password: 'test'});
        }
    }

    onSubmit(form: NgForm) {
        this.loading = true;
        const credentials: Credentials = form.value;
        this.logger.verbose('Logging in');
        setTimeout(() => {
            this.login(credentials);
        }, Config.API_CALL_TIMEOUT);
    }

    private login(credentials: Credentials) {
        this.tokenService.login(credentials)
        .subscribe(() => {
            this.loading = false;
            this.logger.verbose(credentials.email + ' logged in');
        }, (err) => this.loginFailed(err));
    }

    private loginFailed(err: HttpErrorResponse) {
        if (HttpStatus.UNAUTHORIZED === err.status) {
            this.loading = false;
            this.showError = true;
        } else {
            this.logger.error('Something went terribly wrong!', err);
        }
    }
}
