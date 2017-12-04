import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable()
export class Logger {
    verbose(log: string, data: any = null) {
        if (!environment.production) {
            console.log(log);
            if (data !== null) {
                console.log(JSON.stringify(data));
            }
        }
    }

    info(log: string, data: any = null) {
        if (!environment.production) {
            // tslint:disable-next-line:no-console
            console.info(log);
            if (data !== null) {
                // tslint:disable-next-line:no-console
                console.info(JSON.stringify(data));
            }
        }
    }

    error(log: string, err: Error = null) {
        console.error(log);

        if (err !== null) {
            console.error(err);
        }
    }

}
