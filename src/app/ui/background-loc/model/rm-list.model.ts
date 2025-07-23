export class RMList{

    constructor(values: object = {}) {
        Object.assign(this, values);
    }
    public blId?: string = '';
    public flId?: string = '';
    public rmId?: string = '';
    public rmName?: string = '';
    public rmCat:any;
    public rmType:any;
    public rmInfo?:string='';
    public rmArea?: string = '';
    public compId?: number = 0;
    public divId:any;
    public depId:any;
}
