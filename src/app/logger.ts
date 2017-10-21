import { Injectable }     from '@angular/core';
import { ConfigurationService } from './server-api/configuration.service';


@Injectable()
export class Logger {
    verbose(log: string, data:any = null){
        console.log(log);
        if(data !== null){
            console.log(JSON.stringify(data));
        }
    }

    info(log: string, data:any = null){
        console.info(log);
        if(data !== null){
            console.info(JSON.stringify(data));
        }
    }

    error(log: string, err: Error = null){
        console.error(log);

        if(err !== null){
            console.error(err);
        }
    }

}