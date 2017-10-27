import {Component, OnDestroy, OnInit} from '@angular/core';
import {Currency} from '../models/currency';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {User} from '../models/user';
import {UserService} from '../server-api/user.service';
import {CurrencyCacheService} from '../cache/currency-cache.service';
import {Subscription} from 'rxjs/Subscription';
import {Logger} from '../logger';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {PasswordValidation} from './password-validation';

const EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
    selector: 'app-register-view',
    templateUrl: './register-view.component.html',
    styleUrls: ['./register-view.component.css']
})
export class RegisterViewComponent implements OnInit, OnDestroy {
    public user: User = new User();
    public currencies: Currency[] = [];

    private currencySubscription: Subscription;
    private isValidating = false;
    private isLoggingIn = false;
    private showErrorMessage = false;

    registerForm: FormGroup;

    constructor(private router: Router, private location: Location,
                private currencyCacheService: CurrencyCacheService,
                private userService: UserService, private logger: Logger) {
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
                Validators.pattern(EMAIL_REGEX)]),
            password: new FormControl('', [Validators.required, Validators.minLength(4)]),
            repeatPassword: new FormControl('', [Validators.required, Validators.minLength(4)])
        }, PasswordValidation.MatchPassword);
    }

    cancel() {
        this.logger.verbose('cancel register new user.');
        this.resetData();
        this.location.back();
    }

    onSubmit(form: NgForm) {
        this.user = form.value;
        this.logger.verbose('saving user.', this.user);
        this.userService.create(this.user)
            .subscribe(() => this.userSaveSuccess(),
                (err) => this.userSaveFailed(err));
    }

    private isValid(): Boolean {
        return this.user.password === this.user.repeatPassword;
    }

    private userSaveSuccess() {
        this.logger.verbose('success');
    }

    private userSaveFailed(err: Error) {
        this.logger.error('login failed', err);
        this.showErrorMessage = true;
        this.isLoggingIn = false;
    }

    private resetData() {
        this.user = new User();
        this.isLoggingIn = false;
        this.isValidating = false;
        this.showErrorMessage = false;
    }

    private fatalError(err) {
        this.logger.error(err);
    }

    private showFailedFeedback(): any {
        console.error('Could not create user.');
    }
}
