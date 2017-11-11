export class MenuItem{
    name: string;
    route: string;
    icon: string;
    isLabel: boolean;

    constructor(isLabel:boolean, name: string, route: string, icon: string){
        this.isLabel = isLabel;
        this.name = name;
        this.route = route;
        this.icon = icon;
    }
}