export class SiteDetailsList{

    constructor(values: object = {}) {
        Object.assign(this, values);
    }

    public siteId?:string='';
    public siteName?:string='';
    public longitude?: number;
    public latitude?: number;
    public siteInfo?: string='';
    public sitePhoto?: number;
    public ctryId?: string;
    public stateId?: string;
    public regnId?: string;
    public cityId?: string;

}