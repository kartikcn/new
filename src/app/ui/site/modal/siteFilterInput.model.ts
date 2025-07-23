export class SiteFilterInput{
    siteId:string|null="";
  siteName: string = "";
  compId: number = 0;
    
    constructor(id: any, name: string,compId:number){
            this.siteId=id;
            this.siteName = name;
          this.compId = compId;
    }
}
