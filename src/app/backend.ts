import { environment } from '../environments/environment';

export class Backend{
    
    static getUrl(){
        return environment.url;
    }
}