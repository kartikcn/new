export class SiteFilterInputDTO{
    siteId:number|null=null;
  siteName: string = "";
    constructor(siteId: any, siteName: string){
            this.siteId=siteId;
            this.siteName = siteName;
    }
}
