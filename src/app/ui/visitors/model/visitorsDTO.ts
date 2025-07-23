export class Visitors {

    constructor(values: object = {}) {
        Object.assign(this, values);
    }
    public visitorsId?: number;
    public firstName?: string;
    public lastName?: string;
    public email?: string;
    public createdBy?: number;
    public phoneNum?: string;
    public blId?: number;
    public flId?: number;
    public comments?: string;
    public dateStart?: Date;
    public dateEnd?: Date;

}
