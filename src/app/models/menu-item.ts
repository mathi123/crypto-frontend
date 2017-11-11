export class MenuItem{
    name: string;
    route: string;
    icon: string;

    constructor(name: string, route: string, icon: string){
        this.name = name;
        this.route = route;
        this.icon = icon;
    }
}