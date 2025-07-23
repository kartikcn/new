export class BuildingFilterInputDTO {
    blId: number|null = 0;
    blNameString: string = "";
    siteId: number|null = 0;
    constructor(blId: number|null, blNameString: string, siteId: number|null) {
        this.blId = blId;
        this.blNameString = blNameString;
        this.siteId = siteId;
    }
}