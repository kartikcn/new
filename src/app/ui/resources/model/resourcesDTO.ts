export class Resources {

    constructor(values: object = {}) {
        Object.assign(this, values);
    }
    public resourcesId?: number;
    public description?: String;
    public type?: string;
    public quanity?: number;
    public costPerUnit?: number;
    public dateCreated?: Date;
    public timeCreated?: Date;
    public dateLastUpdated?: string;

}
