export class FLFilterInputDTO{
        id:string="";
        name: string = "";
        blId: string = "";
        compId: number = 0;
      constructor(id: string, name: string, blId:string,compId:number){
          this.id=id;
          this.name = name;
          this.blId = blId;
          this.compId = compId;
      }
}
