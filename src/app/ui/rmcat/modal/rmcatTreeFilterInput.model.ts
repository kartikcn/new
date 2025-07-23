export class RmcatTreeFilterInput{
    rmcatId:number|null;
    rmCatDesc: string = "";
    
    constructor(rmcatId: number|null, name: string){
            this.rmcatId=rmcatId;
            this.rmCatDesc=name
    }
}