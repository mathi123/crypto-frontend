export class Color{
    name: string;
    hexValue: string;

    constructor(nm: string, hex: string){
        this.name = nm;
        this.hexValue = hex;
    }

    static getDefaults() : Color[]{
        return [new Color('Purple', '#a42b88'), new Color('Green', '#0e7530')];
    }
}