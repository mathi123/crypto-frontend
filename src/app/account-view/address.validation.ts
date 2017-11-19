import {Directive, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AccountService} from '../server-api/account.service';
import {Config} from '../config';

@Directive({
    /*tslint:disable*/
    selector: '[addressValidation]'
    /*tslint:enable*/
})
export class AddressValidationDirective implements OnChanges {

    @Input() validationFormGroup: FormGroup;
    @Input() updatedDirective = false; // Little trick for updating the Directive manually from a component.
    @Output() validationStart = new EventEmitter();
    @Output() validationEnd = new EventEmitter<object>();

    constructor(private accountService: AccountService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['updatedDirective'].currentValue) {
            this.onBlur();
            this.updatedDirective = false;
        }
    }

    @HostListener('blur', ['$event'])
    onBlur() {
        const coinIdValue = this.validationFormGroup.controls['coinId'].value;
        const addressValue = this.validationFormGroup.controls['address'].value;
        if (addressValue) {
            if (coinIdValue) {
                this.validationStart.emit();
                setTimeout(() => {
                    this.accountService.validate(coinIdValue, addressValue)
                        .subscribe((jsonResponse) => {
                            let response;
                            if (!jsonResponse['valid']) {
                                response = {invalidAddress: true};
                            }
                            this.validationEnd.emit(response);
                        });
                }, Config.API_CALL_TIMEOUT);
            } else {
                this.validationFormGroup.controls['address'].setErrors({coinIdRequired: true});
            }
        }
    }
}
