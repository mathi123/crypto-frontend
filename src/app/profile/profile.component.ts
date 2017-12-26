import {Component, OnInit} from '@angular/core';
import {ConfigurationService} from '../server-api/configuration.service';
import {UserService} from '../server-api/user.service';
import {Location} from '@angular/common';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Config} from '../config';
import {PasswordValidation} from '../utilities/password-validation';
import {User} from '../models/user';
import {CurrencyCacheService} from '../cache/currency-cache.service';
import {Currency} from '../models/currency';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    private static PASSWORD = 'password';
    private static REPEAT_PASSWORD = 'repeatPassword';

    private user: User;

    public loading = false;
    public profileFormGroup: FormGroup;
    public currencies: Currency[] = [];
    public showRepeatPassword = false;
    public showUpdateMessage = false;

    constructor(private configurationService: ConfigurationService,
                private currencyCacheService: CurrencyCacheService,
                private userService: UserService,
                private location: Location) {
    }

    ngOnInit() {
        this.loadData();
        this.initFormGroup();
    }

    onSubmit() {
        this.loading = true;
        const user: User = this.profileFormGroup.getRawValue();
        const mergedUser = {...this.user, ...user}; // spread operator
        this.userService.update(mergedUser)
            .subscribe(() => {
                this.configurationService.loadContext();
                this.profileFormGroup.reset();
                this.loading = false;
                this.updateMessage();
            });
    }

    onCancel() {
        this.location.back();
    }

    private loadData() {
        this.currencyCacheService.getCurrencies()
            .subscribe((currencies) => this.currencies = currencies);
        this.configurationService.UserContext
            .subscribe(context => {
                if (context) {
                    this.userService.readById(context.id)
                        .subscribe(user => {
                            this.loading = true;
                            this.user = user;
                            this.profileFormGroup.patchValue(user);
                        });
                }
            });
    }

    private initFormGroup() {
        this.profileFormGroup = new FormGroup({
            name: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required, Validators.pattern(Config.EMAIL_REGEX)]),
            currencyId: new FormControl('', [Validators.required]),
            password: new FormControl('', []),
            repeatPassword: new FormControl('', [])
        });

        // Conditional validation on the password fields.
        this.profileFormGroup.controls['password'].valueChanges
            .subscribe((password: string) => {
                if (password && password.length > 0 && !this.showRepeatPassword) {
                    this.showRepeatPassword = true;
                    this.profileFormGroup.controls[ProfileComponent.PASSWORD].setValidators([Validators.required,
                        Validators.minLength(Config.PASSWORD_LENGTH)]);
                    this.profileFormGroup.controls[ProfileComponent.REPEAT_PASSWORD].setValidators([Validators.required,
                        Validators.minLength(Config.PASSWORD_LENGTH)]);
                    this.profileFormGroup.setValidators(PasswordValidation.MatchPassword);
                } else if (!password && this.showRepeatPassword) {
                    this.showRepeatPassword = false;
                    this.profileFormGroup.controls[ProfileComponent.PASSWORD].clearValidators();
                    this.profileFormGroup.controls[ProfileComponent.REPEAT_PASSWORD].clearValidators();
                    this.profileFormGroup.clearValidators();
                    this.profileFormGroup.controls[ProfileComponent.PASSWORD].reset();
                    this.profileFormGroup.controls[ProfileComponent.REPEAT_PASSWORD].reset();
                }
            });
    }

    private updateMessage() {
        // show update message for 3 seconds.
        this.showUpdateMessage = true;
        setTimeout(() => {
            this.showUpdateMessage = false;
        }, 3000);
    }
}
