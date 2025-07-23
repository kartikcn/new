export class RoomCategoryFilterInputDTO{
    rmcatId:number|null=0;
    rmCatDesc: string = "";
    
    constructor(rmcatId: number|null, name: string){
            this.rmcatId=rmcatId;
            this.rmCatDesc=name
    }
}