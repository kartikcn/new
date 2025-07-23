export class BLList{

    constructor(values: object = {}) {
        Object.assign(this, values);
    }

    public blId?: string = '';
    public blName?: string = '';
    public siteId?:string='';
    public blInfo?: string = '';
    public longitude?: number = 0;
    public Latitude?: number = 0;
    public blContactName?: string = '';
    public blContactPhone?: string = '';
    
}
