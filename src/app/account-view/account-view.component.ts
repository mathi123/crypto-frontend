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
import { ObservableMedia, MediaChange } from '@angular/flex-layout';

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
        this.coinCacheService.getCoins()
            .subscribe(list => this.showCoinsAndLoadAccount(list));
        this.accountService.readColors()
            .subscribe(colors => this.showColors(colors));
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
        // this.account.transactionType = form.value.transactionType;

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
        const coin = this.coins.find(c => c.id === coinId);
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
            color: new FormControl(''),
            // transactionType: new FormControl('', Validators.required)
        });
    }

    private showColors(colors: Color[]) {
        this.colors = colors;
    }

    private showCoinsAndLoadAccount(coins: Coin[]) {
        this.showCoins(coins);
        this.routeParamsSubscription = this.route.params.subscribe(params => this.routeChanged(params));
    }

    private routeChanged(params: {[key: string]: any}) {
        const id = params['id'];
        if (id === undefined || id === null || id === '0') {
            this.account = new Account();
            this.account.transactionType = 'auto';
        } else {
            this.accountService
                .readById(id)
                .subscribe(account => this.showAccount(account));
        }
    }

    private showAccount(account: Account) {
        this.account = account;
    }

    private showCoins(list: Coin[]) {
        this.coins = list.filter(c => c.isActive);
        this.coinObservable = this.stateCtrl.valueChanges
            .startWith(null)
            .map(coin => coin && typeof coin === 'object' ? coin.description : coin)
            .map(description => description ? this.filter(description) : this.coins.slice());
    }
}

