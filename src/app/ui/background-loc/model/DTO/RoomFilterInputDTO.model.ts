export class RoomFilterInputDTO {
    rmId: number|null = 0;
    rmNameString: string = "";
    blId: number|null = 0;
    flId: number|null = 0;
    constructor(rmId: number|null, rmNameString: string, blId: number|null, flId: number|null) {
        this.rmId = rmId;
        this.rmNameString = rmNameString;
        this.blId = blId;
        this.flId = flId;
    }
}
