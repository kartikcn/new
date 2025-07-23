export class EqStdDTO {
    displayName?: String | null;
    eqStd?: string | null;
    description?: string | null;
    compId?: number
    constructor(displayName: string, eqStd: string, description: string, compId: number) {
        this.displayName = displayName;
        this.eqStd = eqStd;
        this.description = description;
        this.compId = compId;
    }
}