import {Component, OnInit} from '@angular/core';
import {Account} from '../models/account';
import {Coin} from '../models/coin';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {Color} from '../models/color';
import {CoinCacheService} from '../cache/coin-cache.service';
import {TransactionType} from '../models/transaction-type';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {Logger} from '../logger';
import {ArrayUtil} from '../common/array.util';
import { AccountService } from '../server-api/account.service';

@Component({
    selector: 'app-account-view',
    templateUrl: './account-view.component.html',
    styleUrls: ['./account-view.component.css']
})
export class AccountViewComponent implements OnInit {
    account: Account = new Account();
    accountForm: FormGroup;
    stateCtrl: FormControl;
    coinObservable: Observable<Coin[]>;
    colors: Color[] = [];
    transactionTypes = [
        new TransactionType('auto', 'Load automatically'),
        new TransactionType('manually', 'Load manually')
    ];
    loading = false;
    updateDirective = false;

    private routeParamsSubscription: Subscription;
    private coins: Coin[] = [];

    constructor(private location: Location,
                private route: ActivatedRoute,
                private accountService: AccountService,
                private coinCacheService: CoinCacheService,
                private logger: Logger) {
    }

    ngOnInit() {
        this.buildFormGroup();
        this.loadCoins();
        this.routeParamsSubscription = this.route.params.subscribe(params => {

            const id = params['id'];
            if (id === undefined || id === null || id === '0') {
                this.account = new Account();
                this.loadColors();
            } else {
                // Note: Timeout needed because otherwise the coins weren't loaded yet,
                // this way the displayFn will not work properly.
                setTimeout(() => {
                    this.accountService.readById(id)
                        .subscribe(account => {
                            if (account) {
                                this.account = account;
                                this.loadColors(account);
                            }
                        });
                }, 100);
            }
        });
    }

    optionSelected() {
        this.updateDirective = true;
    }

    validationStart() {
        this.loading = true;
        this.accountForm.disable();
    }

    validationEnd(response) {
        this.loading = false;
        this.accountForm.enable();
        this.accountForm.controls['address'].setErrors(response);
        this.updateDirective = false;
    }

    onSubmit(form: NgForm) {
        this.logger.verbose('Save account');
        this.account.coinId = form.value.coinId;
        this.account.description = form.value.description;
        this.account.address = form.value.address;
        this.account.color = form.value.color;
        this.account.transactionType = form.value.transactionType;

        if (this.account.id === null || this.account.id === undefined) {
            this.accountService.create(this.account)
                .subscribe(res => this.afterUpdate(),
                           err => this.handleError(err));
        }else {
            this.accountService.update(this.account)
                .subscribe(res => this.afterUpdate(),
                           err => this.handleError(err));
        }
    }

    private handleError(err: Error) {
        this.logger.error('error in updating/creating account', err);
    }

    private afterUpdate() {
        this.location.back();
    }

    cancel() {
        this.logger.verbose('cancel');
        this.location.back();
    }

    /**
     * Display function used by the Material Auto Complete.
     * @param {string} coinId
     * @returns {string}
     */
    displayFn(coinId: string): string {
        const coin: Coin = this.coins.find(c => c.id === coinId);
        return !coin ? '' : coinId ? coin.description : '';
    }


    /**
     * Filter function used for the Material Auto complete.
     * @param {string} description
     * @returns {Coin[]}
     */
    private filter(description: string): Coin[] {
        return this.coins.filter(coin =>
            coin.description.toLowerCase().indexOf(description.toLowerCase()) === 0);
    }

    /**
     * Build the FormGroup with accompanying FromControls.
     */
    private buildFormGroup() {
        this.stateCtrl = new FormControl('', Validators.required);
        this.accountForm = new FormGroup({
            coinId: this.stateCtrl,
            description: new FormControl('', Validators.required),
            address: new FormControl('', Validators.required),
            color: new FormControl('', Validators.required),
            transactionType: new FormControl('', Validators.required)
        });
    }

    /**
     * Load the coins.
     */
    private loadCoins() {
        this.coinCacheService.getCoins()
            .subscribe(list => {
                this.coins = list;
                this.coinObservable = this.stateCtrl.valueChanges
                    .startWith(null)
                    .map(coin => coin && typeof coin === 'object' ? coin.description : coin)
                    .map(description => description ? this.filter(description) : this.coins.slice());
            });
    }

    /**
     * Load the colors, use the defaults colors.
     * Note: List of colors will be filtered, existing colors that
     * already are selected by another account will not be shown.
     */
    private loadColors(account?: Account) {
        // TODO : maybe generate colors instead of fixed values? --> More accounts than colors?
        this.colors = Color.getDefaults();
        this.accountService.read()
            .subscribe((accounts) => {
                if (account) {
                    accounts = accounts.filter(acc => acc.id !== account.id);
                }
                accounts.forEach(acc => {
                    ArrayUtil.removeByProperty(this.colors, 'hexValue', acc.color);
                });
            });
    }
}

