export class SvgElementIdType{
    public roomElementId: string|null;
    public assetElementId: string|null;
    constructor( roomElementId: string|null, assetElementId: string|null) {
        this.roomElementId = roomElementId;
        this.assetElementId = assetElementId;
    }
}