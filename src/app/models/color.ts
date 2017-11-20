export class Color {
    name: string;
    hexValue: string;

    constructor(nm: string, hex: string) {
        this.name = nm;
        this.hexValue = hex;
    }

    static getDefaults(): Color[] {
        return [
            new Color('Purple', '#ab47bc'),
            new Color('Green', '#0e7530'),
            new Color('Red', '#ef5350'),
            new Color('Indigo', '#5c6bc0'),
            new Color('Blue', '#29b6f6'),
            new Color('Jungle Green', '#26a69a'),
            new Color('Yellow', '#ffee58'),
            new Color('Orange', '#ff7043'),
        ];
    }
}