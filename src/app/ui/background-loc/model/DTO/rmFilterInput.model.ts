export class RMFilterInputDTO{
        id:string="";
        name: string = "";
        blId: string = "";
        flId: string = "";
        compId: number = 0;
        
      constructor(id: string, name: string, blId:string,flId:string,compId:number){
          this.id=id;
          this.name = name;
          this.blId = blId;
          this.flId = flId;
          this.compId = compId;
      }
}
