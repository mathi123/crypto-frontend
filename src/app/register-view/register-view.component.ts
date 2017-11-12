import {Component, OnDestroy, OnInit} from '@angular/core';
import {Currency} from '../models/currency';
import {Location} from '@angular/common';
import {User} from '../models/user';
import {UserService} from '../server-api/user.service';
import {CurrencyCacheService} from '../cache/currency-cache.service';
import {Subscription} from 'rxjs/Subscription';
import {Logger} from '../logger';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {PasswordValidation} from './password-validation';
import * as HttpStatus from 'http-status-codes';
import {HttpErrorResponse} from '@angular/common/http';
import 'rxjs/add/operator/map';
import {Response} from '@angular/http';
import {Credentials} from '../models/credentials';
import {TokenService} from '../server-api/token-service';
import {Config} from '../config';

@Component({
    selector: 'app-register-view',
    templateUrl: './register-view.component.html',
    styleUrls: ['./register-view.component.css']
})
export class RegisterViewComponent implements OnInit, OnDestroy {
    public user: User = new User();
    public currencies: Currency[] = [];
    public loading = false;
    public registerForm: FormGroup;
    public showErrorMessage = false;

    private currencySubscription: Subscription;

    constructor(private location: Location,
                private currencyCacheService: CurrencyCacheService,
                private tokenService: TokenService,
                private userService: UserService,
                private logger: Logger) {
    }

    ngOnInit() {
        this.initForm();
        this.currencySubscription = this.currencyCacheService.getCurrencies()
            .subscribe(currencies => this.currencies = currencies,
                err => this.fatalError(err));
    }

    ngOnDestroy() {
        this.currencySubscription.unsubscribe();
    }

    private initForm() {
        this.registerForm = new FormGroup({
            name: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required,
                Validators.pattern(Config.EMAIL_REGEX)]),
            password: new FormControl('', [Validators.required, Validators.minLength(Config.PASSWORD_LENGTH)]),
            repeatPassword: new FormControl('', [Validators.required, Validators.minLength(Config.PASSWORD_LENGTH)]),
            currencyId: new FormControl('', Validators.required)
        }, PasswordValidation.MatchPassword);
    }

    onSubmit(form: FormGroup) {
        this.loading = true;
        this.user = form.value;
        this.logger.verbose('saving user.', this.user);
        this.userService.create(this.user)
            .subscribe((res: Response) => {
                if (HttpStatus.CREATED === res.status) {
                    this.userCreatedSuccess();
                }
            }, (err) => this.userSaveFailed(err));
    }

    onBlur(form: FormGroup) {
        if (form.controls['email'].valid) {
            this.userService.validateEmail(form.controls['email'].value)
                .subscribe(() => {
                }, (error: HttpErrorResponse) => {
                    // TODO : how to remove error message in console ? ( zone.js )
                    if (HttpStatus.CONFLICT === error.status) {
                        form.controls['email'].setErrors({conflict: true});
                    }
                });
        }
    }

    private userCreatedSuccess() {
        // One second time-out -> server is to fast :-)
        setTimeout(() => {
            const credentials = new Credentials();
            credentials.email = this.user.email;
            credentials.password = this.user.password;
            this.tokenService.login(credentials)
                .subscribe(() => {
                    this.loading = false;
                }, (err) => this.fatalError(err));
        }, Config.API_CALL_TIMEOUT);
    }

    private userSaveFailed(err: Error) {
        console.log(err);
        this.showErrorMessage = true;
    }

    private resetData() {
        this.user = new User();
    }

    private fatalError(err) {
        this.logger.error(err);
    }
}
