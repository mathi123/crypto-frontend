export class MenuItem{
    name: string;
    route: string;
    requiresLogin: boolean;
    hideAfterLogin: boolean;
    icon: string;

    constructor(name: string, route: string, requiresLogin: boolean, hideAfterLogin:boolean, icon: string){
        this.name = name;
        this.route = route;
        this.requiresLogin = requiresLogin;
        this.hideAfterLogin = hideAfterLogin;
        this.icon = icon;
    }
}