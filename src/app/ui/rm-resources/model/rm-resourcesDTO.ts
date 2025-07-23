export class RmResourcesDTO {

    constructor(values: object = {}) {
        Object.assign(this, values);
    }
    public blId?: number;
    public flId?: number;
    public rmId?: number;
    public quanity?: number;
    public costPerUnit?: number;
    public resourcesId?:number;
    public comments?: string;
    public rmResourcesId?:number;


}

