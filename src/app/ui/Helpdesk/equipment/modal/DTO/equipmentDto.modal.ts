export class Equipment {
    displayEqId?: string;
    eqId?: any;
    eqStd?: string;
    blId?: string;
    flId?: string;
    rmId?: string;
    status?: number;
    description?: string;
    eqCode?:string

    constructor(displayEqId: string, eqId: any, eqStd: string, blId: string, flId: string, rmId: string, status: number, description: string, eqCode:string) {
        this.displayEqId = displayEqId;
        this.eqId = eqId;
        this.eqStd = eqStd;
        this.blId = blId;
        this.flId = flId;
        this.rmId = rmId;
        this.status = status;
        this.description = description;
        this.eqCode= eqCode;
    }
}
