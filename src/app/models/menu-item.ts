export class MenuItem {
    name: string;
    route: string;
    icon: string;
    isLabel: boolean;
    subItems: MenuItem[];

    constructor(isLabel: boolean, name: string, route: string, icon: string, subItems?: MenuItem[]) {
        this.isLabel = isLabel;
        this.name = name;
        this.route = route;
        this.icon = icon;
        this.subItems = subItems;
    }

    hasSubItems(): boolean {
        return this.subItems && this.subItems.length > 0;
    }
}
