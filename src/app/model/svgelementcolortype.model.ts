export class SvgElementColorType{
    public roomColor: string|null;
    public assetColor: string|null;
    constructor( roomColor: string|null, assetColor: string|null) {
        this.roomColor = roomColor;
        this.assetColor = assetColor;
    }
}