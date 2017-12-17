import {AbstractControl} from '@angular/forms';

export class PasswordValidation {
    static MatchPassword(ac: AbstractControl) {
        const password = ac.get('password').value;
        const repeatPassword = ac.get('repeatPassword').value;
        if (password !== repeatPassword) {
            ac.get('repeatPassword').setErrors({matchPassword: true});
        } else {
            return null;
        }
    }
}
