export class SiteList{

    constructor(values: object = {}) {
        Object.assign(this, values);
    }

    public siteId?: string = '';
    public siteName?: string = '';
    
    public siteInfo?: string = '';
    public longitude?: number = 0;
    public Latitude?: number = 0;
    public siteContactName?: string = '';
    public siteContactPhone?: string = '';
    public comp_id?: number = 0;
    
}
