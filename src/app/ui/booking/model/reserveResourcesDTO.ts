export class ReserveResourcesDTO {

    constructor(values: object = {}) {
        Object.assign(this, values);
    }
    public reserveRsId?: number;
    public reserveId?: number;
    public blId?: number;
    public flId?: number;
    public rmId?: number;
    public qty?: number;
    public comments?: string;
    public resourcesId?: number;
    public costPerUnit?:number;
    public totalCost?:number;
    public isReusable?:string;
    public type?:string;
}